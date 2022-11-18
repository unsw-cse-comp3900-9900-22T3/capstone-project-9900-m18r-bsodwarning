import sys
import json, time
from flask_cors import *
from flask import Flask, jsonify, request
import uuid
import random
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from dao.entity.recipe import Recipe
from dao.entity.user_subscribe import UserSubscribe
from dao.entity.comment import Comment
from dao.entity.user_likes import UserLikes
from dao.entity.user_collections import UserCollections
from controller.user_action_controller import UserAction
from controller.recipe_action_controller import RecipeAction
from controller.comment_action_controller import CommentAction
from conf.dao_config import *
from dao.milvus_service import MilvusService
from transformers import AutoModel, AutoTokenizer
import clip
import base64
from io import BytesIO
from PIL import Image
import re
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy import create_engine

material_engine = create_engine(f'mysql+pymysql://{mysql_username}:{mysql_passwd}@{mysql_hostname}:{mysql_port}/{material_db_name}')
if not database_exists(material_engine.url):
    create_database(material_engine.url)
print(database_exists(material_engine.url))

user_engine = create_engine(f'mysql+pymysql://{mysql_username}:{mysql_passwd}@{mysql_hostname}:{mysql_port}/{user_info_db_name}')
if not database_exists(user_engine.url):
    create_database(user_engine.url)
print(database_exists(user_engine.url))

comment_engine = create_engine(f'mysql+pymysql://{mysql_username}:{mysql_passwd}@{mysql_hostname}:{mysql_port}/{comment_db_name}')
if not database_exists(comment_engine.url):
    create_database(comment_engine.url)
print(database_exists(comment_engine.url))


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
# ingredients vector
milvus_server = MilvusService(collection_name)
simcse_recipe_ingredients_dir = "Shengtao/simcse_recipe_ingredients"
simcse_tokenizer = AutoTokenizer.from_pretrained(simcse_recipe_ingredients_dir)
simcse_model = AutoModel.from_pretrained(simcse_recipe_ingredients_dir)
# title vector
recipe_title_search = MilvusService("recipe_title_search")
simcse_recipe_title_dir = "Shengtao/simcse_recipe_title"
simcse_tokenizer_recipe_title = AutoTokenizer.from_pretrained(simcse_recipe_title_dir)
simcse_model_recipe_title = AutoModel.from_pretrained(simcse_recipe_title_dir)
# image vector
recipe_image_search = MilvusService("recipe_image_search")
clip_model, clip_preprocess = clip.load("ViT-B/32")

# allow cross domain access
CORS(app, supports_credentials=True)


@app.route('/register', methods=["POST"])
def register():
    """user registration
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.username = request_dict["username"]
    user.email = request_dict["email"]
    user.password = request_dict["password"]

    # Query whether the current username has been used
    result = UserAction().user_is_exist(user, "login")

    if result != 0:
        return jsonify({"code": 500, "error": "this email is exists"})

    # generate uuid

    # user.age = request_dict["age"]
    # user.gender = request_dict["gender"]
    # user.city = request_dict["city"]

    # Add registered user
    save_res = UserAction().save_user(user)
    if not save_res:
        return jsonify({"code": 500, "error": "register fail."})

    return jsonify({"code": 200, "msg": "register success."})


@app.route('/login', methods=["POST"])
def login():
    """user login
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.email = request_dict["email"]
    user.password = request_dict["password"]
    a = request_dict.get("description", '')
    # Query whether the username or password exists in the database
    try:
        result = UserAction().user_is_exist(user, "login")
        # print(result,"login")
        if result == 1:
            detail = UserAction().get_user_detail_by_email(user)
            return jsonify({"code": 200, "msg": "login success", "avatar": detail.avatar})
        elif result == 2:
            # wrong password
            return jsonify({"code": 501, "error": "password error"})
        else:
            return jsonify({"code": 502, "error": "this email does not exist!"})
    except Exception as e:
        return jsonify({"code": 500, "error": "login fail."})


@app.route('/profile/query/<email>', methods=["GET"])
def profile_query(email):
    """Query user profile
    """
    user = RegisterUser()
    user.email = email
    recipe = Recipe()
    recipe.author = email
    collection = UserCollections()
    collection.userid = email

    try:
        user_detail = UserAction().get_user_detail_by_email(user)
        recipe_detail = RecipeAction().get_recipe_index_by_author(recipe)
        collection_list = UserAction().get_collect_by_email(collection)
        if recipe_detail:
            recipe_detail = list(map(lambda x: str(x[0]), recipe_detail))
        if collection_list:
            collection_list = list(map(lambda x: str(x[0]), collection_list))
        return jsonify({"code": 200, "msg": "profile query success", "profile": {
            "username": user_detail.username,
            "email": user_detail.email,
            "password": user_detail.password,
            "gender": user_detail.gender,
            "age": user_detail.age,
            "height": user_detail.height,
            "weight": user_detail.weight,
            "level": user_detail.level,
            "time": user_detail.time,
            "city": user_detail.city,
            "avatar": user_detail.avatar,
            "allergies": user_detail.allergies.split(";") if user_detail.allergies else [],
            "preference": user_detail.preference.split(";") if user_detail.preference else [],
            "post": recipe_detail,
            "collection_list": collection_list
        }})
    except Exception as e:
        return jsonify({"code": 500, "error": "profile query fail."})


@app.route('/profile/alter', methods=["POST", "GET"])
def profile_alter():
    """Edit user profile
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    # user.username = request_dict["username"]
    user.email = request_dict["email"]
    allergies = request_dict.get("allergies", '')
    if allergies:
        request_dict["allergies"] = ";".join(allergies)
    preference = request_dict.get("preference", '')
    if preference:
        request_dict["preference"] = ";".join(preference)
    try:
        save_res = UserAction().alter_user(user, request_dict)
    except Exception as e:
        return jsonify({"code": 501, "error": "profile alter fail1."})
    if not save_res:
        return jsonify({"code": 500, "error": "profile alter fail."})

    return jsonify({"code": 200, "msg": "profile alter success."})


@app.route('/home', methods=["POST", "GET"])
def home():
    """Query homepage
    """
    # Return 12 indexes randomly
    recipe = Recipe()
    recipe_list = []
    while len(recipe_list) != 12:
        indexes = RecipeAction().rand_get_index(12)
        for i in indexes:
            recipe.index = i
            recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
            if recipe_detail.image and i not in recipe_list:
                recipe_list.append(i)
                if len(recipe_list) == 12:
                    break
    cover = False
    while not cover:
        advertisement_index = RecipeAction().rand_get_index(num=1)[0]
        recipe.index = advertisement_index
        recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
        cover = recipe_detail.image
    return jsonify({"RecipeId": recipe_list,
                    "advertisement": {"cover": cover, "id": advertisement_index}
                    })


@app.route('/recipe/card/<index>/<email>', methods=["GET"])
def recipe_card(index, email):
    """Recipe Thumbnails
    """
    recipe = Recipe()
    recipe.index = index
    collectionState = False
    likeState = False
    like = UserLikes()
    like.recipeid = index
    like_count = UserAction().get_like_count_by_recipe_id(like)
    collection = UserCollections()
    collection.recipeid = index
    collection_count = UserAction().get_collection_count_by_recipe_id(collection)
    try:
        recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
        usercollection = UserCollections()
        usercollection.userid = email
        usercollection.recipeid = recipe_detail.index
        if email != "0":
            collectionState = UserAction().collection_is_exist(usercollection)
            userlike = UserLikes()
            userlike.userid = email
            userlike.recipeid = recipe_detail.index
            likeState = UserAction().like_is_exist(userlike)
        return jsonify({"code": 200,
                        "msg": "recipe card query success",
                        "cover": recipe_detail.image,
                        "tittle": recipe_detail.title,
                        "isliked": likeState,
                        "iscollected": collectionState,
                        "create_time": recipe_detail.createtime,
                        "like_count": like_count,
                        "collection_count": collection_count
                        })
    except Exception as e:
        return jsonify({"code": 500, "error": "recipe card query fail."})


@app.route('/recipe/details/<index>/<email>', methods=["GET"])
def recipe_detail(index, email):
    """Recipe Details Page
    """
    recipe = Recipe()
    recipe.index = index
    user = RegisterUser()
    like = UserLikes()
    like.recipeid = index
    try:
        recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
        ingredients_list = [i.strip().split(" ", 1) for i in
                            recipe_detail.ingredients.strip().split(";")] if recipe_detail.ingredients else None
        ingredients_dict = [{"amount": i[0], 'ingredient': i[1]} for i in ingredients_list] if ingredients_list else []
        user.email = recipe_detail.author
        up_detail = UserAction().get_user_detail_by_email(user)
        like_count = UserAction().get_like_count_by_recipe_id(like)
        subscribeState = False
        collectionState = False
        likeState = False
        comment_list = CommentAction().getCommentByRecipeid(index)
        result_list = []
        for row in comment_list:
            user.email = row.userid
            detail = UserAction().get_user_detail_by_email(user)
            result_list.append({
                'commentid': row.commentid,
                'username': detail.username,
                'userid': detail.email,
                'content': row.content,
                'createtime': row.curtime,
                'avatar': detail.avatar
            })
        if email != "0":
            usersubscribe = UserSubscribe()
            usersubscribe.userid = email
            usersubscribe.subscribed_id = recipe_detail.author
            subscribeState = UserAction().subscribe_is_exist(usersubscribe)
            usercollection = UserCollections()
            usercollection.userid = email
            usercollection.recipeid = recipe_detail.index
            collectionState = UserAction().collection_is_exist(usercollection)
            userlike = UserLikes()
            userlike.userid = email
            userlike.recipeid = recipe_detail.index
            likeState = UserAction().like_is_exist(userlike)
        # recommendation
        recommendation_list = []
        data_token = simcse_tokenizer(recipe_detail.ingredients, padding="max_length", max_length=128, truncation=True,
                                      return_tensors="pt")
        embedding = simcse_model(**data_token).pooler_output.detach().numpy()
        results = milvus_server.search_with_embedding(embedding, topk=7)
        for i in results[0]:
            if i.id != int(index):
                recommendation_list.append(i.id)
        return jsonify({"code": 200,
                        "msg": "recipe card query success",
                        "detail": {
                            "likeCount": like_count,
                            "subscribeState": subscribeState,
                            "CollectionState": collectionState,
                            "likeState": likeState,
                            "title": recipe_detail.title,
                            "url": recipe_detail.url,
                            "category": recipe_detail.category.split(',') if recipe_detail.category else None,
                            "author": recipe_detail.author,
                            "author_name": up_detail.username,
                            "author_avatar": up_detail.avatar,
                            "description": recipe_detail.description,
                            "rating": recipe_detail.rating,
                            "rating_count": recipe_detail.rating_count,
                            "review_count": recipe_detail.review_count,
                            "ingredients": ingredients_dict,
                            "directions": recipe_detail.directions,
                            "prep_time": recipe_detail.prep_time,
                            "cook_time": recipe_detail.cook_time,
                            "total_time": recipe_detail.total_time,
                            "servings": recipe_detail.servings,
                            "yields": recipe_detail.yields,
                            "calories": recipe_detail.calories,
                            "carbohydrates_g": recipe_detail.carbohydrates_g,
                            "sugars_g": recipe_detail.sugars_g,
                            "fat_g": recipe_detail.fat_g,
                            "saturated_fat_g": recipe_detail.saturated_fat_g,
                            "cholesterol_mg": recipe_detail.cholesterol_mg,
                            "protein_g": recipe_detail.protein_g,
                            "dietary_fiber_g": recipe_detail.dietary_fiber_g,
                            "sodium_mg": recipe_detail.sodium_mg,
                            "calories_from_fat": recipe_detail.calories_from_fat,
                            "calcium_mg": recipe_detail.calcium_mg,
                            "iron_mg": recipe_detail.iron_mg,
                            "magnesium_mg": recipe_detail.magnesium_mg,
                            "potassium_mg": recipe_detail.potassium_mg,
                            "zinc_mg": recipe_detail.zinc_mg,
                            "phosphorus_mg": recipe_detail.phosphorus_mg,
                            "vitamin_a_iu_IU": recipe_detail.vitamin_a_iu_IU,
                            "niacin_equivalents_mg": recipe_detail.niacin_equivalents_mg,
                            "vitamin_b6_mg": recipe_detail.vitamin_b6_mg,
                            "vitamin_c_mg": recipe_detail.vitamin_c_mg,
                            "folate_mcg": recipe_detail.folate_mcg,
                            "thiamin_mg": recipe_detail.thiamin_mg,
                            "riboflavin_mg": recipe_detail.riboflavin_mg,
                            "vitamin_e_iu_IU": recipe_detail.vitamin_e_iu_IU,
                            "vitamin_k_mcg": recipe_detail.vitamin_k_mcg,
                            "biotin_mcg": recipe_detail.biotin_mcg,
                            "vitamin_b12_mcg": recipe_detail.vitamin_b12_mcg,
                            "mono_fat_g": recipe_detail.mono_fat_g,
                            "poly_fat_g": recipe_detail.poly_fat_g,
                            "trans_fatty_acid_g": recipe_detail.trans_fatty_acid_g,
                            "omega_3_fatty_acid_g": recipe_detail.omega_3_fatty_acid_g,
                            "omega_6_fatty_acid_g": recipe_detail.omega_6_fatty_acid_g,
                            "instructions_list": eval(
                                recipe_detail.instructions_list) if recipe_detail.instructions_list else '',
                            "stepImage_list": eval(recipe_detail.step_images) if recipe_detail.step_images else '',
                            "cover": recipe_detail.image,
                            "comment": result_list,
                            "recommendation": recommendation_list
                        }})
    except Exception as e:
        return jsonify({"code": 500, "error": "recipe detail query fail."})


@app.route('/search', methods=["post"])
def recipe_search():
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    like = UserLikes()
    recipe = Recipe()
    if request_dict["method"] == "ingredients":
        data_token = simcse_tokenizer(request_dict["data"], padding="max_length", max_length=128, truncation=True,
                                      return_tensors="pt")
        embedding = simcse_model(**data_token).pooler_output.detach().numpy()
        results = milvus_server.search_with_embedding(embedding, topk=int(request_dict["topk"]))
    elif request_dict["method"] == "title":
        data_token = simcse_tokenizer_recipe_title(request_dict["data"], padding="max_length", max_length=128,
                                                   truncation=True,
                                                   return_tensors="pt")
        embedding = simcse_model_recipe_title(**data_token).pooler_output.detach().numpy()
        results = recipe_title_search.search_with_embedding(embedding, topk=int(request_dict["topk"]))
    elif request_dict["method"] == "image":
        base64_data = re.sub('^data:image/.+;base64,', '', request_dict["data"])
        image = Image.open(BytesIO(base64.b64decode(base64_data)))
        inputs = clip_preprocess(image).unsqueeze(0)
        embedding = clip_model.encode_image(inputs).detach().numpy()
        results = recipe_image_search.search_with_embedding(embedding, topk=int(request_dict["topk"]))
    else:
        return jsonify(
            {"code": 500,
             "msg": "search fail"
             }
        )
    recipelist_json = []
    for i in results[0]:
        like.recipeid = i.id
        recipe.index = i.id
        if RecipeAction().recipe_is_exist(recipe):
            like_count = UserAction().get_like_count_by_recipe_id(like)
            recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
            recipe_dict = {"recipe_id": i.id, "uploader_email": recipe_detail.author,
                           "upload_time": recipe_detail.createtime, "like_count": like_count}
            recipelist_json.append(recipe_dict)
    return jsonify({"code": 200,
                    "RecipeId": recipelist_json
                    })


@app.route('/recipe/create/', methods=["POST"])
def create_recipe():
    """Create/Contribute the recipe from user to the system
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    recipe = Recipe()
    recipe.title = request_dict.get("name", None)
    recipe.category = ','.join(request_dict["tags"])
    recipe.author = request_dict.get("email", None)
    recipe.description = request_dict.get("description", None)
    recipe.rating = request_dict.get("rating", None)
    # Currently, undefined in the frontend
    recipe.rating_count = request_dict.get("rating_count", None)
    recipe.review_count = request_dict.get("review_count", None)
    recipe.directions = request_dict.get("directions", None)
    recipe.prep_time = request_dict.get("prep_time", None)
    recipe.cook_time = request_dict.get("cook_time", None)
    recipe.total_time = request_dict.get("total_time", None)
    recipe.yields = request_dict.get("yields", None)
    recipe.calories = request_dict.get("calories", None)
    recipe.directions = request_dict.get("directions", None)
    recipe.image = request_dict.get("cover", None)
    ingredient_pair = request_dict.get("ingredient", None)
    if ingredient_pair[0]["ingredient"] and ingredient_pair[0]["amount"]:
        ingredient_list = ['{} {}'.format(pair['amount'], pair['ingredient']) for pair in ingredient_pair]
        ingredient_str = ';'.join(ingredient_list)
        recipe.ingredients = ingredient_str
    else:
        recipe.ingredients = None

    step_pair = request_dict.get("Step", '')
    if step_pair:
        cover_list = ['{}'.format(pair['cover']) for pair in step_pair]
        descript_list = ['{}'.format(pair['description']) for pair in step_pair]
        recipe.step_images = str(cover_list) if cover_list else None
        recipe.instructions_list = str(descript_list) if descript_list else None
    else:
        recipe.step_images = None
        recipe.instructions_list = None
    # save to mysql
    save_recipe, index = RecipeAction().save_recipe(recipe)
    # save to milvus
    if recipe.title:
        if recipe_title_search.query_with_id(index):
            recipe_title_search.delete_entity_by_id(index)
        data_token = simcse_tokenizer_recipe_title(recipe.title, padding="max_length", max_length=128,
                                                   truncation=True,
                                                   return_tensors="pt")
        embedding = simcse_model_recipe_title(**data_token).pooler_output.detach().numpy()
        recipe_title_search.insert(embedding, index)
        if recipe_image_search.query_with_id(index):
            recipe_image_search.delete_entity_by_id(index)
        inputs = clip.tokenize(recipe.title)
        embedding = clip_model.encode_text(inputs).detach().numpy()
        recipe_image_search.insert(embedding, index)
    if recipe.ingredients:
        if milvus_server.query_with_id(index):
            milvus_server.delete_entity_by_id(index)
        data_token = simcse_tokenizer(recipe.ingredients, padding="max_length", max_length=128, truncation=True,
                                      return_tensors="pt")
        embedding = simcse_model(**data_token).pooler_output.detach().numpy()
        milvus_server.insert(embedding, index)
    if not save_recipe:
        return jsonify({"code": 500,
                        "error": "Fail to save recipe!"})

    return jsonify({"code": 200,
                    "msg": "Create recipe successfully."})


@app.route('/recipe/edit/<recipe_id>', methods=["POST"])
def edit_recipe(recipe_id):
    """Edit the Info of Recipe by its own user
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    recipe = Recipe()
    recipe.index = recipe_id
    recipe_dict = {"index": recipe_id, "title": request_dict.get("name", None),
                   "category": ','.join(request_dict["tags"]), "author": request_dict.get("email", None),
                   "description": request_dict.get("description", None), "rating": request_dict.get("rating", None),
                   "rating_count": request_dict.get("rating_count", None),
                   "review_count": request_dict.get("review_count", None),
                   "directions": request_dict.get("directions", None), "prep_time": request_dict.get("prep_time", None),
                   "cook_time": request_dict.get("cook_time", None), "total_time": request_dict.get("total_time", None),
                   "yields": request_dict.get("yields", None), "calories": request_dict.get("calories", None),
                   "image": request_dict.get("cover", None)}
    # Currently, undefined in the frontend
    ingredient_pair = request_dict.get("ingredient", '')
    if ingredient_pair[0]["ingredient"] and ingredient_pair[0]["amount"]:
        ingredient_list = ['{} {}'.format(pair['amount'], pair['ingredient']) for pair in ingredient_pair]
        ingredient_str = ';'.join(ingredient_list)
        recipe_dict["ingredients"] = ingredient_str
    else:
        recipe_dict["ingredients"] = ''
    step_pair = request_dict.get("Step", '')
    if step_pair:
        cover_list = ['{}'.format(pair['cover']) for pair in step_pair]
        descript_list = ['{}'.format(pair['description']) for pair in step_pair]
        cover_str = ' '.join(cover_list)
        descript_str = ' '.join(descript_list)
        recipe_dict["step_images"] = str(cover_list) if cover_list else "[]"
        recipe_dict["instructions_list"] = str(descript_list) if descript_list else "[]"
    else:
        recipe_dict["step_images"] = "[]"
        recipe_dict["instructions_list"] = "[]"

    try:
        updated_reciped = RecipeAction().edit_recipe(recipe, recipe_dict)
        index = int(recipe_id)
        if recipe.title:
            if recipe_title_search.query_with_id(index):
                recipe_title_search.delete_entity_by_id(index)
            data_token = simcse_tokenizer_recipe_title(recipe.title, padding="max_length", max_length=128,
                                                       truncation=True,
                                                       return_tensors="pt")
            embedding = simcse_model_recipe_title(**data_token).pooler_output.detach().numpy()
            recipe_title_search.insert(embedding, index)
            if recipe_image_search.query_with_id(index):
                recipe_image_search.delete_entity_by_id(index)
            inputs = clip.tokenize(recipe.title)
            embedding = clip_model.encode_text(inputs).detach().numpy()
            recipe_image_search.insert(embedding, index)
        if recipe.ingredients:
            if milvus_server.query_with_id(index):
                milvus_server.delete_entity_by_id(index)
            data_token = simcse_tokenizer(recipe.ingredients, padding="max_length", max_length=128, truncation=True,
                                          return_tensors="pt")
            embedding = simcse_model(**data_token).pooler_output.detach().numpy()
            milvus_server.insert(embedding, index)
    except Exception as e:
        return jsonify({"code": 501, "error": "invalid email/RecipeId"})
    if not updated_reciped:
        return jsonify({"code": 500, "error": "invalid email/RecipeId."})

    return jsonify({"code": 200, "msg": "Recipe info updated."})


@app.route('/delete/recipe/<recipe_id>', methods=["POST"])
def delete_recipe(recipe_id):
    """Delete the recipe
    """

    del_recipe = RecipeAction().del_recipe_by_user(recipe_id)
    if not del_recipe:
        return jsonify({"code": 500, "error": "invalid email/RecipeId"})

    return jsonify({"code": 200, "msg": "you have deleted this recipe"})


@app.route('/subscribe/<email>', methods=["GET"])
def user_subscribe_info(email):
    """user subscribe page
    """
    user = RegisterUser()
    user.email = email
    recipe = Recipe()
    recipe.author = email
    like = UserLikes()
    try:

        follow, follow_count, follower_count, subscribed_ids = UserAction().get_subscribe_by_user_id(user)

        recipe_detail = RecipeAction().get_subscribe_by_subscribed_ids(subscribed_ids)
        post_count = RecipeAction().get_post_count_by_author(recipe)
        # print(follow)
        follow_json = []
        for follow_tuple in follow:
            follow_dict = {}
            if follow_tuple[0] is None:
                follow_dict["avatar"] = ""
            else:
                follow_dict["avatar"] = follow_tuple[0]
            if follow_tuple[1] is None:
                follow_dict["username"] = ""
            else:
                follow_dict["username"] = follow_tuple[1]
            if follow_tuple[2] is None:
                follow_dict["email"] = ""
            else:
                follow_dict["email"] = follow_tuple[2]
            follow_json.append(follow_dict)

        recipelist_json = []
        for recipe_tuple in recipe_detail:
            like.recipeid = recipe_tuple[0]
            like_count = UserAction().get_like_count_by_recipe_id(like)
            recipe_dict = {"recipe_id": recipe_tuple[0], "uploader_email": recipe_tuple[1],
                           "upload_time": recipe_tuple[2], "like_count": like_count}
            recipelist_json.append(recipe_dict)
        result = UserAction().user_is_exist(user, "query")
        # print(result,"login")
        if result == 1:
            detail = UserAction().get_user_detail_by_email(user)
            return jsonify({"code": 200,
                            "avatar": detail.avatar,
                            "username": detail.username,
                            "follow": follow_json,
                            "msg": "subscribe query success",
                            "follower_count": str(follower_count),
                            "follow_count": str(follow_count),
                            "post": str(post_count),
                            "RecipeList": recipelist_json
                            })
        else:
            return jsonify({"code": 500, "msg": "email not exists"})
    except Exception as e:
        return jsonify({"code": 500, "error": "subscribe query fail."})


# add the relation between user and subscribed_user
@app.route('/user_subscribe', methods=["POST"])
def user_subscribe():
    """user subscribe
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    subscribe = UserSubscribe()
    subscribe.userid = request_dict["user_email"]
    subscribe.subscribed_id = request_dict["subscribed_email"]
    # user subscribe
    subscribe_res = UserAction().user_subscribe(subscribe)
    # print(subscribe_res)
    if subscribe_res == 1:
        return jsonify({"code": 500, "error": "You have subscribed this user."})
    elif subscribe_res == 2:
        return jsonify({"code": 500, "error": "subscribe fail."})
    return jsonify({"code": 200, "msg": "subscribe success."})


# delete the relation between user and subscribed_user
@app.route('/user_cancel_subscribe', methods=["POST"])
def user_cancel_subscribe():
    """cancel subscribe
    """
    # user cancel the subscribe
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    subscribe = UserSubscribe()
    subscribe.userid = request_dict["user_email"]
    subscribe.subscribed_id = request_dict["subscribed_email"]
    subscribe_cancel_res = UserAction().del_subscribe_by_user(subscribe)
    if not subscribe_cancel_res:
        return jsonify({"code": 500, "error": "subscribe cancel fail."})

    return jsonify({"code": 200, "msg": "subscribe cancel success."})


# add the relation between user and collection
@app.route('/user_collection', methods=["POST"])
def user_collection():
    """user collection
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    collection = UserCollections()
    collection.userid = request_dict["user_email"]
    collection.recipeid = request_dict["recipeid"]
    # user collection
    collection_res = UserAction().user_collection(collection)
    # print(subscribe_res)
    if collection_res == 1:
        return jsonify({"code": 500, "error": "You have collect this user."})
    elif collection_res == 2:
        return jsonify({"code": 500, "error": "collect fail."})
    return jsonify({"code": 200, "msg": "collect success."})


# delete the relation between user and collection
@app.route('/user_cancel_collection', methods=["POST"])
def user_cancel_collection():
    """cancel collection
    """
    # user cancel the subscribe
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    collection = UserCollections()
    collection.userid = request_dict["user_email"]
    collection.recipeid = request_dict["recipeid"]
    collection_cancel_res = UserAction().del_collection_by_user(collection)
    if not collection_cancel_res:
        return jsonify({"code": 500, "error": "collection cancel fail."})

    return jsonify({"code": 200, "msg": "collection cancel success."})


# add the relation between user and collection
@app.route('/user_like', methods=["POST"])
def user_like():
    """user like
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    like = UserLikes()
    like.userid = request_dict["user_email"]
    like.recipeid = request_dict["recipeid"]
    # user like
    like_res = UserAction().user_like(like)
    if like_res == 1:
        return jsonify({"code": 500, "error": "You have liked this user."})
    elif like_res == 2:
        return jsonify({"code": 500, "error": "like fail."})
    return jsonify({"code": 200, "msg": "like success."})


# delete the relation between user and like
@app.route('/user_cancel_like', methods=["POST"])
def user_cancel_like():
    """cancel like
    """
    # user cancel the like
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    like = UserLikes()
    like.userid = request_dict["user_email"]
    like.recipeid = request_dict["recipeid"]
    like_cancel_res = UserAction().del_like_by_user(like)
    if not like_cancel_res:
        return jsonify({"code": 500, "error": "like cancel fail."})

    return jsonify({"code": 200, "msg": "like cancel success."})


@app.route('/addcomment', methods=["POST"])
def addComment():
    """add user comment
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    comment = Comment()

    comment.userid = request_dict["email"]
    comment.content = request_dict["content"]
    comment.recipeid = request_dict["recipeid"]

    # Add registered user
    try:
        temp_comment_id = CommentAction().addComment(comment)
        return jsonify({"code": 200, "msg": "add success.", "commentid": temp_comment_id})
    except Exception as e:
        return jsonify({"code": 500, "error": "add failed."})

    return jsonify({"code": 200, "error": "query add success."})


@app.route('/getcommentByRecipeid', methods=["POST"])
def getCommentByRecipeid():
    """Get Recipe Comment
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    recipeid = request_dict["recipeid"]
    user = RegisterUser()
    # Get Recipe Comment
    try:
        comment_list = CommentAction().getCommentByRecipeid(recipeid)
        result_list = []
        for row in comment_list:
            user.email = row.userid

            result_list.append({
                'commentid': row.commentid,
                'userid': row.userid,
                'content': row.content,
                'createtime': row.curtime
            })
        # print(result_list)
        # return jsonify(result_list)
        return jsonify({"code": 200, "msg": "all info got.", "result_list": result_list})
    except Exception as e:
        return jsonify({"code": 500, "error": "delete failed."})


@app.route('/deleteCommentById', methods=["POST"])
def deleteCommentById():
    """delete user comments
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    commentid = request_dict["commentid"]

    # delete Recipe comments
    try:
        CommentAction().deleteCommentByCommentid(commentid)
        return jsonify({"code": 200, "msg": "delete success."})
    except Exception as e:
        return jsonify({"code": 500, "error": "delete failed."})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=19900, threaded=True)
