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

    # 查询数据库中的用户名或者密码是否存在
    try:
        result = UserAction().user_is_exist(user, "login")
        # print(result,"login")
        if result == 1:
            detail = UserAction().get_user_detail_by_email(user)
            return jsonify({"code": 200, "msg": "login success","avatar":detail.avatar})
        elif result == 2:
            # 密码错误
            return jsonify({"code": 501, "error": "password is error"})
        else:
            return jsonify({"code": 502, "error": "this email is not exist!"})
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


@app.route('/recipe/detail/<index>', methods=["GET"])
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
                            "instructions_list": eval(recipe_detail.instructions_list),
                            "cover": recipe_detail.image
                        }})
    except Exception as e:
        return jsonify({"code": 500, "error": "recipe card query fail."})

##TO DO CREATE RECIPE
@app.route('/recipe/create/', methods=["POST"])
def create_recipe():
    request_str = request.get_data()
    request_dict = json.loads(request_str)
    
    recipe = Recipe()
    recipe.author = request_dict["email"]
    recipe.title = request_dict["name"]
    recipe.image = request_dict["cover"]
    recipe.description = request_dict["description"]
    recipe.ingredients = request_dict["ingredient"]
    recipe.instructions_list = request_dict["Step"]
    recipe.category = request_dict["tags"]
    
    recipe.index = uuid.uuid1().hex
    
    save_recipe = RecipeAction().save_recipe(recipe)
    
    return jsonify({"code": 200, 
                    "msg": "create recipe successfully."})
    
## ALTER RECIPE, DEL RECIPE
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3010, threaded=True)
