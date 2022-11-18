import sys

sys.path.append("../")
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from conf.dao_config import *


class MysqlServer(object):
    def __init__(self, username="root", passwd=mysql_passwd, hostname=mysql_hostname, port=mysql_port,
                 user_info_db_name=user_info_db_name, material_db_name=material_db_name):
        self.username = username
        self.passwd = passwd
        self.hostname = hostname
        self.port = port
        self.user_info_db_name = user_info_db_name
        self.material_db_name = material_db_name
        self.comment_db_name = comment_db_name

    def session(self, db_name):
        """connect with the database, create the mapping relationship
        """
        # create engine
        engine = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(
            self.username, self.passwd, self.hostname, self.port, db_name
        ), encoding="utf-8", echo=False,pool_recycle=60)
        # create session
        session = sessionmaker(bind=engine)
        # return engine and session, 
        # The engine is used to bind local data,，
        # The session is used to operate the database locally
        return engine, session()

    def get_register_user_session(self):
        """Get session of user registration
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_user_like_session(self):
        """Get session of user likes
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_user_collection_session(self):
        """Get session of user collections
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_user_exposure_session(self):
        """Get session of user exposure
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_user_read_session(self):
        """Get session of user read
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_register_user_engine(self):
        """Get engine of user registration
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_user_like_engine(self):
        """Get engine of user likes
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_user_collection_engine(self):
        """Get engine of user collection
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_user_read_engine(self):
        """Get engine of user read
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_user_exposure_engine(self):
        """Get engine of user exposure
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_recipe_detail_session(self):
        """Get session of recipe details
        """
        _, session = self.session(self.material_db_name)
        return session

    def get_recipe_detail_engine(self):
        """Get engine of recipe details
        """
        engine, _ = self.session(self.material_db_name)
        return engine

    def get_user_subscribe_session(self):
        """Get session of user subscribe
        """
        _, session = self.session(self.user_info_db_name)
        return session

    def get_user_subscribe_engine(self):
        """Get engine of user subscribes
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine

    def get_comment_engine(self):
        """Get engine of comment info
        """
        engine, _ = self.session(self.comment_db_name)
        return engine

    def get_comment_session(self):
        """Get session of comment info
        """
        _, session = self.session(self.comment_db_name)
        return session
