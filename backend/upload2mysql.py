import pandas as pd
from conf.dao_config import (mysql_username,
mysql_passwd,
mysql_hostname,
mysql_port,
material_db_name,user_info_db_name,comment_db_name)

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
recipes = pd.read_csv("recipe/recipe.csv")

engine = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(
            mysql_username, mysql_passwd, mysql_hostname, mysql_port, material_db_name
        ), encoding="utf-8", echo=False)

recipes.to_sql('recipe_detail', con=engine,if_exists="append",index=False)

register = pd.DataFrame()

register["username"] = recipes["author"]

register["password"] = register["username"]

register["email"] = register["username"]

engine1 = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(
            mysql_username, mysql_passwd, mysql_hostname, mysql_port, user_info_db_name
        ), encoding="utf-8", echo=False)

register = register.drop(index=398)

register.drop_duplicates(subset=["username"],inplace=True)

register.to_sql("register_user",con=engine1,if_exists='append',index=False)