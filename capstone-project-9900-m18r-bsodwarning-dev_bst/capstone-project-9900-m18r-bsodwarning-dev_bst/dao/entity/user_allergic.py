from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger, DateTime

from conf.dao_config import user_allergic_table_name
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func

Base = declarative_base()

class UserAllergic(Base):
    """用户收藏新闻数据
    """
    __tablename__ = user_allergic_table_name
    userid = Column(BigInteger(), primary_key=True)
    allergic = Column(String(300))

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_user_allergic_engine()
        Base.metadata.create_all(engine)

    def new(self,userid,allergic):
        self.userid = userid  
        self.allergic = allergic
        # self.curtime = curtime