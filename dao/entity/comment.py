from sqlalchemy import Column, String, Integer, BLOB,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger

from conf.dao_config import comment_table_name
from dao.mysql_server import MysqlServer

Base = declarative_base()

class Comment(Base):
    """评论数据
    """
    __tablename__ = comment_table_name 
    userid = Column(Integer(), primary_key=True)
    content = Column(String(500))
    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_comment_engine()
        Base.metadata.create_all(engine)

   