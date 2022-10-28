import sys

sys.path.append("./")
import json, time
from flask_cors import *
from flask import Flask, jsonify, request
import uuid
import random
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from dao.entity.recipe import Recipe
from dao.entity.logitem import LogItem
from dao.entity.user_likes import UserLikes
from dao.entity.user_collections import UserCollections
from controller.user_action_controller import UserAction
from controller.recipe_action_controller import RecipeAction

app = Flask(__name__)

# 允许跨域访问
CORS(app, supports_credentials=True)


@app.route('/register', methods=["POST"])
def register():
    """用户注册
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.username = request_dict["username"]
    user.email = request_dict["email"]
    user.password = request_dict["password"]

    # 查询当前用户名是否已经被用过了
    result = UserAction().user_is_exist(user, "register")

    if result != 0:
        return jsonify({"code": 500, "error": "this email is exists"})

    # generate uuid
    user.userid = uuid.uuid1().hex

    # user.age = request_dict["age"]
    # user.gender = request_dict["gender"]
    # user.city = request_dict["city"]

    # 添加注册用户
    save_res = UserAction().save_user(user)
    if not save_res:
        return jsonify({"code": 500, "error": "register fail."})

    return jsonify({"code": 200, "msg": "register success."})


@app.route('/login', methods=["POST"])
def login():
    """用户登录
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.email = request_dict["email"]
    user.password = request_dict["password"]
    a = request_dict.get("description",'')
    # 查询数据库中的用户名或者密码是否存在
    try:
        result = UserAction().user_is_exist(user, "login")
        # print(result,"login")
        if result == 1:
            detail = UserAction().get_user_detail_by_email(user)
            return jsonify({"code": 200, "msg": "login success","avatar":detail.avatar})
        elif result == 2:
            # 密码错误
            return jsonify({"code": 501, "error": "password error"})
        else:
            return jsonify({"code": 502, "error": "this email does not exist!"})
    except Exception as e:
        return jsonify({"code": 500, "error": "login fail."})


@app.route('/profile/query', methods=["POST", "GET"])
def profile_query():
    """用户个人主页查询
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.email = request_dict["email"]

    try:
        user_detail = UserAction().get_user_detail_by_email(user)
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
            "avatar": user_detail.avatar
        }})
    except Exception as e:
        return jsonify({"code": 500, "error": "profile query fail."})


@app.route('/profile/alter', methods=["POST", "GET"])
def profile_alter():
    """用户个人主页更改
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    user = RegisterUser()
    user.username = request_dict["username"]
    user.email = request_dict["email"]
    try:
        save_res = UserAction().alter_user(user, request_dict)
    except Exception as e:
        return jsonify({"code": 501, "error": "profile alter fail1."})
    if not save_res:
        return jsonify({"code": 500, "error": "profile alter fail."})

    return jsonify({"code": 200, "msg": "profile alter success."})


@app.route('/home', methods=["POST", "GET"])
def home():
    """主页查询
    """
    # 随机返回十二个index
    index_list = [random.randint(0, 26634) for _ in range(12)]
    return jsonify({"RecipeId": index_list})


@app.route('/recipe/card/<index>', methods=["GET"])
def recipe_card(index):
    """菜谱缩略图
    """
    recipe = Recipe()
    recipe.index = index
    try:
        recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
        return jsonify({"code": 200,
                        "msg": "recipe card query success",
                        "cover": recipe_detail.image,
                        "tittle": recipe_detail.title,
                        "isliked": False,
                        "iscollected": False
                        })
    except Exception as e:
        return jsonify({"code": 500, "error": "recipe card query fail."})


@app.route('/recipe/details/<index>', methods=["GET"])
def recipe_detail(index):
    """菜谱详情页
    """
    recipe = Recipe()
    recipe.index = index
    try:
        recipe_detail = RecipeAction().get_recipe_detail_by_index(recipe)
        return jsonify({"code": 200,
                        "msg": "recipe card query success",
                        "detail": {
                            "title": recipe_detail.title,
                            "url": recipe_detail.url,
                            "category": recipe_detail.category,
                            "author": recipe_detail.author,
                            "description": recipe_detail.description,
                            "rating": recipe_detail.rating,
                            "rating_count": recipe_detail.rating_count,
                            "review_count": recipe_detail.review_count,
                            "ingredients": recipe_detail.ingredients.split(";"),
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
                            "instructions_list": eval(recipe_detail.instructions_list) if recipe_detail.instructions_list else '',
                            "cover": recipe_detail.image
                        }})
    except Exception as e:
        return jsonify({"code": 500, "error": "recipe card query fail."})

@app.route('/recipe/create/', methods=["POST"])
def create_recipe():
    """Create/Contribute the recipe from user to the system
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    recipe = Recipe()

    max_index = RecipeAction().get_the_max_index()
    ##Generate the id based on the current maximum number of database in case duplicate index occur
    max_index+=1

    recipe.index = max_index
    recipe.title = request_dict.get("name", '')
    recipe.category = ','.join(request_dict["tags"])
    recipe.author = request_dict.get("email", '')
    recipe.description = request_dict.get("description", '')
    recipe.rating = request_dict.get("rating", '')

    ##Currently, undefined in the frontend
    recipe.rating_count = request_dict.get("rating_count", '')
    recipe.review_count = request_dict.get("review_count", '')
    recipe.directions = request_dict.get("directions", '')
    recipe.prep_time = request_dict.get("prep_time", '')
    recipe.cook_time = request_dict.get("cook_time", '')
    recipe.total_time = request_dict.get("total_time", '')
    recipe.yields = request_dict.get("yields", '')
    recipe.calories = request_dict.get("calories", '')
    recipe.directions = request_dict.get("directions", '')

    recipe.image = request_dict.get("cover", '')

    ingredient_pair = request_dict.get("ingredient", '')
    if ingredient_pair:
        ingredient_list = ['{} {}'.format(pair['amount'],pair['ingredient']) for pair in ingredient_pair]
        ingredient_str = ';'.join(ingredient_list)
        recipe.ingredients = ingredient_str
    else:
        recipe.ingredients = ''

    step_pair = request_dict.get("Step", '')
    if step_pair:
        cover_list = ['{}'.format(pair['cover']) for pair in step_pair]
        descript_list = ['{}'.format(pair['description']) for pair in step_pair]
        cover_str = ' '.join(cover_list)
        descript_str = ' '.join(descript_list)

        recipe.step_images = cover_str if cover_str else ''
        recipe.instructions_list = descript_str if descript_str else ''
    else:
        recipe.step_images = ''
        recipe.instructions_list = ''

    save_recipe = RecipeAction().save_recipe(recipe)

    if not save_recipe:
        return jsonify({"code": 500,
                    "error": "Fail to save recipe!"})

    return jsonify({"code": 200,
                    "msg": "Create recipe successfully."})

@app.route('/recipe/edit/<Recipe_ID>', methods=["POST"])
def edit_recipe(Recipe_ID):
    """Edit the Info of Recipe by its own user
    """
    request_str = request.get_data()
    request_dict = json.loads(request_str)

    recipe_dict = {}

    recipe_dict["index"] = Recipe_ID
    recipe_dict["title"] = request_dict.get("name", '')
    recipe_dict["category"] = ','.join(request_dict["tags"])
    recipe_dict["author"] = request_dict.get("email", '')
    recipe_dict["description"] = request_dict.get("description", '')
    recipe_dict["rating"] = request_dict.get("rating", '')

    ##Currently, undefined in the frontend
    recipe_dict["rating_count"] = request_dict.get("rating_count", '')
    recipe_dict["review_count"] = request_dict.get("review_count", '')
    recipe_dict["directions"] = request_dict.get("directions", '')
    recipe_dict["prep_time"] = request_dict.get("prep_time", '')
    recipe_dict["cook_time"] = request_dict.get("cook_time", '')
    recipe_dict["total_time"] = request_dict.get("total_time", '')
    recipe_dict["yields"] = request_dict.get("yields", '')
    recipe_dict["calories"] = request_dict.get("calories", '')
    recipe_dict["directions"] = request_dict.get("directions", '')

    recipe_dict["image"] = request_dict.get("cover", '')

    ingredient_pair = request_dict.get("ingredient", '')
    if ingredient_pair:
        ingredient_list = ['{} {}'.format(pair['amount'],pair['ingredient']) for pair in ingredient_pair]
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

        recipe_dict["step_images"] = cover_str if cover_str else ''
        recipe_dict["instructions_list"] = descript_str if descript_str else ''
    else:
        recipe_dict["step_images"] = ''
        recipe_dict["instructions_list"] = ''

    try:
        updated_reciped = RecipeAction().edit_recipe(Recipe_ID, recipe_dict)
    except Exception as e:
        return jsonify({"code": 501, "error": "invalid email/RecipeId"})
    if not updated_reciped:
        return jsonify({"code": 500, "error": "invalid email/RecipeId."})

    return jsonify({"code": 200, "msg": "Recipe info updated."})

@app.route('/delete/recipe/<Recipe_ID>', methods=["POST"])
def delete_recipe(Recipe_ID):
    """Delete the recipe
    """
    del_recipe = RecipeAction().del_recipe_by_user(Recipe_ID)
    if not del_recipe:
        return jsonify({"code": 500, "error":"invalid email/RecipeId"})

    return jsonify({"code": 200, "msg":"you have deleted this recipe"})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3010, threaded=True)
