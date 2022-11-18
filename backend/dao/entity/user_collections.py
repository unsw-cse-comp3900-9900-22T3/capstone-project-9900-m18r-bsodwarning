from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger, DateTime

from conf.dao_config import user_collections_table_name
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func

Base = declarative_base()


class UserCollections(Base):
    """data of user collections
    """
    __tablename__ = user_collections_table_name
    index = Column(Integer(), primary_key=True, autoincrement=True)
    userid = Column(String(100))
    recipeid = Column(String(100))
    curtime = Column(DateTime(timezone=True), server_default=func.now())

    def __init__(self):
        # Mapping relationship with database
        engine = MysqlServer().get_user_collection_engine()
        Base.metadata.create_all(engine)

    def new(self, userid, recipeid):
        self.userid = userid
        self.recipeid = recipeid
        # self.curtime = curtime
