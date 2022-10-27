from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger

from conf.dao_config import user_subscribe_table_name
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func

Base = declarative_base()

class UserSubscribe(Base):
    """用户订阅
    """
    __tablename__ = user_subscribe_table_name
    index = Column(Integer(), primary_key=True, autoincrement=True)
    userid = Column(String(30))
    subscribed_id = Column(String(30))
    curtime = Column(DateTime(timezone=True), server_default=func.now())

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_user_subscribe_engine()
        Base.metadata.create_all(engine)

    def new(self,userid,subscribed_id):
        self.userid = userid
        self.username = subscribed_id
        # self.curtime = curtime