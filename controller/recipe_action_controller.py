from dao.mysql_server import MysqlServer
from dao.entity.recipe import Recipe
from sqlalchemy import create_engine
from conf.dao_config import mysql_hostname

recipe = Recipe()

class RecipeAction():
    def __init__(self) -> None:
        self.recipe_detail_sql_session = MysqlServer().get_recipe_detail_session()
    
    ##Get the maximum number of recipe through the last row of index
    def get_the_max_index(self):
        max_row = self.recipe_detail_sql_session.query(Recipe).order_by(Recipe.index.desc()).first()
        return max_row.index

    def save_recipe(self, recipe):
        try:
            self.recipe_detail_sql_session.add(recipe)
            self.recipe_detail_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def del_recipe_by_user(self, recipe_id):
        try:
            delItems = self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == recipe_id)
            if delItems.count() == 0:
                return False
            self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == recipe_id).delete()
            self.recipe_detail_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def edit_recipe(self, Recipe_ID, recipe_dict):
        try:
            found_recipe = self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == Recipe_ID)
            if found_recipe.count() == 0:
                return False
            found_recipe.update(recipe_dict)
            self.recipe_detail_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def get_recipe_detail_by_index(self, recipe):
        try:
            recipe_detail = \
            self.recipe_detail_sql_session.query(Recipe).filter(Recipe.index == recipe.index).one()
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