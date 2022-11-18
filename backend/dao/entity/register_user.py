from sqlalchemy import Column, String, Integer, BLOB,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from conf.dao_config import register_user_table_name
from dao.mysql_server import MysqlServer

Base = declarative_base()

class RegisterUser(Base):
    """data of user registration
    """
    __tablename__ = register_user_table_name
    userid = Column(BigInteger(), primary_key=True,autoincrement=True)
    username = Column(String(100))
    email = Column(String(100))
    password = Column(String(500))
    gender = Column(String(30))
    age = Column(String(5))
    height = Column(String(30))
    weight = Column(String(30))
    level = Column(String(30))
    time = Column(String(30))
    city = Column(String(10))
    avatar = Column(MEDIUMTEXT())
    allergies = Column(Text())
    preference = Column(Text())
    def __init__(self):
        # Mapping relationship with database
        engine = MysqlServer().get_register_user_engine()
        Base.metadata.create_all(engine)