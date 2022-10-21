from dao.mysql_server import MysqlServer
from dao.entity.recipe import Recipe
from sqlalchemy import create_engine
from conf.dao_config import mysql_hostname

user = Recipe()

class RecipeAction():
    def __init__(self) -> None:
        self.recipe_detail_sql_session = MysqlServer().get_recipe_detail_session()

    def alter_recipe(self, recipe,detail):
        try:
            self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == user.index).update(detail)
            # self.register_user_sql_session.
            self.recipe_detail_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def get_recipe_detail_by_index(self, user):
        try:
            recipe_detail = \
            self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == user.index).one()
        except Exception as e:
            print(str(e))
            return None
        return recipe_detail


username = 'root'
hostname = mysql_hostname
port = '3306'
passwd = 'comp9900'
db_name = 'recipeinfo'

engine = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(
            username, passwd, hostname, port, db_name
        ), encoding="utf-8", echo=False)