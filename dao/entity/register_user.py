from sqlalchemy import Column, String, Integer, BLOB,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger

from conf.dao_config import register_user_table_name
from dao.mysql_server import MysqlServer

Base = declarative_base()

class RegisterUser(Base):
    """用户注册数据
    """
    __tablename__ = register_user_table_name 
    index = Column(Integer(), primary_key=True)
    userid = Column(BigInteger())
    username = Column(String(30))
    email = Column(String(30))
    password = Column(String(500))
    gender = Column(String(30))
    age = Column(String(5))
    height = Column(String(30))
    weight = Column(String(30))
    level = Column(String(30))
    time = Column(String(30))
    city = Column(String(10))
    avatar = Column(Text())

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_register_user_engine()
        Base.metadata.create_all(engine)