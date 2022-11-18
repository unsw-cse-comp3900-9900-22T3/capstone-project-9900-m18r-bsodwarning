from sqlalchemy import Column, String, Integer, BLOB,Text,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger

from conf.dao_config import comment_table_name
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func



Base = declarative_base()

class Comment(Base):
    """data of comment
    """
    __tablename__ = comment_table_name 
    commentid = Column(Integer(), primary_key=True, autoincrement=True)
    content = Column(String(500))
    recipeid = Column(String(50))
    curtime = Column(DateTime(timezone=True), server_default=func.now())
    userid = Column(Integer(), primary_key=True)
    def __init__(self):
        # Mapping relationship with database
        engine = MysqlServer().get_comment_engine()
        Base.metadata.create_all(engine)
    def new(self,userid,content,recipeid):
        self.userid = userid
        self.content = content  
        self.recipeid =  recipeid
      
   