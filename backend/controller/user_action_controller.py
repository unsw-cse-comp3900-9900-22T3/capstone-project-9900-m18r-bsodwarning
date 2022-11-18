from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from dao.entity.user_likes import UserLikes
from dao.entity.user_read import UserRead
from dao.entity.user_collections import UserCollections
from dao.entity.user_subscribe import UserSubscribe

# initialize data table
user = UserLikes()
user = UserCollections()
user = UserRead()
user = UserSubscribe()


class UserAction():
    def __init__(self) -> None:
        self.user_exposure_sql_session = MysqlServer().get_user_exposure_session()
        self.register_user_sql_session = MysqlServer().get_register_user_session()
        self.user_like_sql_session = MysqlServer().get_user_like_session()
        self.user_collection_sql_session = MysqlServer().get_user_collection_session()
        self.user_read_sql_session = MysqlServer().get_user_read_session()
        # chong tong
        self.user_subscribe_sql_session = MysqlServer().get_user_subscribe_session()

    def user_is_exist(self, user, user_type):
        """
        1 means correct; 2 means wrong password; 0 means user does not exist
        """
        if user_type == "login":
            if self.register_user_sql_session.query(RegisterUser).filter(RegisterUser.email == user.email, \
                                                                         RegisterUser.password == user.password).count() > 0:
                return 1
            elif self.register_user_sql_session.query(RegisterUser).filter(
                    RegisterUser.email == user.email).count() > 0:
                return 2
            else:
                return 0
        else:
            if self.register_user_sql_session.query(RegisterUser).filter(
                    RegisterUser.email == user.email).count() > 0:
                return 1
            else:
                return 0

    def save_user(self, user):
        try:
            self.register_user_sql_session.add(user)
            # self.register_user_sql_session.
            self.register_user_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def alter_user(self, user, detail):
        try:
            self.register_user_sql_session.query(RegisterUser).filter(RegisterUser.email == user.email).update(detail)
            # self.register_user_sql_session.
            self.register_user_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def get_user_id_by_name(self, username):

        try:
            userid = \
                self.register_user_sql_session.query(RegisterUser.userid).filter(
                    RegisterUser.username == username).one()[0]
        except Exception as e:
            print(str(e))
            return None
        return userid

    def get_user_detail_by_email(self, user):
        try:
            user_detail = \
                self.register_user_sql_session.query(RegisterUser).filter(RegisterUser.email == user.email).one()
        except Exception as e:
            print(str(e))
            return None
        return user_detail

    def get_likes_counts_by_user(self, user_id, news_id):
        return self.user_like_sql_session.query(UserLikes).filter(UserLikes.userid == user_id,
                                                                  UserLikes.newid == news_id).count()

    def get_coll_counts_by_user(self, user_id, news_id):
        return self.user_collection_sql_session.query(UserCollections).filter(UserCollections.userid == user_id,
                                                                              UserCollections.newid == news_id).count()

    # chong tong
    # user subscribe
    def user_subscribe(self, subscribe):
        # You have subscribed this user
        if self.user_subscribe_sql_session.query(UserSubscribe).filter(UserSubscribe.userid == subscribe.userid, \
                                                                       UserSubscribe.subscribed_id == subscribe.subscribed_id).count() > 0:
            return 1
        try:
            self.user_subscribe_sql_session.add(subscribe)
            self.user_subscribe_sql_session.commit()
        except Exception as e:
            print(str(e))
            # subscribe failed
            return 2
        # subscribe successfully
        return 3

    def user_collection(self, collection):
        # You have collected this user
        if self.user_collection_sql_session.query(UserCollections).filter(UserCollections.userid == collection.userid, \
                                                                          UserCollections.recipeid == collection.recipeid).count() > 0:
            return 1
        try:
            self.user_collection_sql_session.add(collection)
            self.user_collection_sql_session.commit()
        except Exception as e:
            print(str(e))
            # collect failed
            return 2
        # collect successfully
        return 3

    def user_like(self, like):
        # You have liked this user
        if self.user_like_sql_session.query(UserLikes).filter(UserLikes.userid == like.userid, \
                                                              UserLikes.recipeid == like.recipeid).count() > 0:
            return 1
        try:
            self.user_like_sql_session.add(like)
            self.user_like_sql_session.commit()
        except Exception as e:
            print(str(e))
            # collect failed
            return 2
        # collect successfully
        return 3

    def del_collection_by_user(self, collection):
        try:
            print(collection.userid, collection.recipeid)
            delItems = self.user_collection_sql_session.query(UserCollections).filter(
                UserCollections.userid == collection.userid,
                UserCollections.recipeid == collection.recipeid)
            # print(delItems.count())
            if delItems.count() > 0:
                self.user_collection_sql_session.query(UserCollections).filter(
                    UserCollections.userid == collection.userid,
                    UserCollections.recipeid == collection.recipeid).delete()
                self.user_collection_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def del_like_by_user(self, like):
        try:
            print(like.userid, like.recipeid)
            delItems = self.user_like_sql_session.query(UserLikes).filter(
                UserLikes.userid == like.userid,
                UserLikes.recipeid == like.recipeid)
            # print(delItems.count())
            if delItems.count() > 0:
                self.user_like_sql_session.query(UserLikes).filter(
                    UserLikes.userid == like.userid,
                    UserLikes.recipeid == like.recipeid).delete()
                self.user_like_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def subscribe_is_exist(self, subscribe):
        if self.user_subscribe_sql_session.query(UserSubscribe).filter(UserSubscribe.userid == subscribe.userid, \
                                                                       UserSubscribe.subscribed_id == subscribe.subscribed_id).count() > 0:
            return True
        else:
            return False

    def collection_is_exist(self, collection):
        if self.user_collection_sql_session.query(UserCollections).filter(UserCollections.userid == collection.userid, \
                                                                          UserCollections.recipeid == collection.recipeid).count() > 0:
            return True
        else:
            return False

    def like_is_exist(self, like):
        if self.user_like_sql_session.query(UserLikes).filter(UserLikes.userid == like.userid, \
                                                              UserLikes.recipeid == like.recipeid).count() > 0:
            return True
        else:
            return False

    def get_subscribe_by_user_id(self, user):
        try:
            subscribed_ids = \
                self.user_subscribe_sql_session.query(UserSubscribe.subscribed_id).filter(
                    UserSubscribe.userid == user.email).all()
            # print(type(subscribed_ids[0]))
            subscribed_ids = list(map(lambda x: x[0], subscribed_ids))
            # print(subscribed_ids)
            follow = \
                self.register_user_sql_session.query(RegisterUser.avatar, RegisterUser.username,
                                                     RegisterUser.email).filter(
                    RegisterUser.email.in_(subscribed_ids)).all()
            follower_count = \
                self.user_subscribe_sql_session.query(UserSubscribe).filter(
                    UserSubscribe.subscribed_id == user.email).count()
            follow_count = \
                self.user_subscribe_sql_session.query(UserSubscribe).filter(
                    UserSubscribe.userid == user.email).count()
        except Exception as e:
            print(str(e))
            return None
        return follow, follow_count, follower_count, subscribed_ids

    def del_subscribe_by_user(self, subscribe):
        try:
            print(subscribe.userid, subscribe.subscribed_id)
            delItems = self.user_subscribe_sql_session.query(UserSubscribe).filter(
                UserSubscribe.userid == subscribe.userid,
                UserSubscribe.subscribed_id == subscribe.subscribed_id)
            # print(delItems.count())
            if delItems.count() > 0:
                self.user_subscribe_sql_session.query(UserSubscribe).filter(
                    UserSubscribe.userid == subscribe.userid,
                    UserSubscribe.subscribed_id == subscribe.subscribed_id).delete()
                self.user_subscribe_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def del_coll_by_user(self, user_id, news_id):
        try:
            delItems = self.user_collection_sql_session.query(UserCollections).filter(UserCollections.userid == user_id,
                                                                                      UserCollections.newid == news_id)
            if delItems.count() > 0:
                self.user_collection_sql_session.query(UserCollections).filter(UserCollections.userid == user_id,
                                                                               UserCollections.newid == news_id).delete()
                self.user_collection_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True

    def get_like_count_by_recipe_id(self, like):
        post_count = \
            self.user_like_sql_session.query(UserLikes).filter(
                UserLikes.recipeid == like.recipeid).count()
        return post_count

    def get_collection_count_by_recipe_id(self, collection):
        post_count = \
            self.user_collection_sql_session.query(UserCollections).filter(
                UserCollections.recipeid == collection.recipeid).count()
        return post_count

    def get_collect_by_email(self, collection):
        post_count = \
            self.user_collection_sql_session.query(UserCollections.recipeid).filter(
                UserCollections.userid == collection.userid).all()
        return post_count

    def save_one_action(self, action):
        if isinstance(action, UserLikes):
            try:
                self.user_like_sql_session.add(action)
                self.user_like_sql_session.commit()
            except Exception as e:
                print(str(e))
                return False
        elif isinstance(action, UserCollections):
            try:
                self.user_collection_sql_session.add(action)
                self.user_collection_sql_session.commit()
            except Exception as e:
                print(str(e))
                return False
        elif isinstance(action, UserRead):
            try:
                self.user_read_sql_session.add(action)
                self.user_read_sql_session.commit()
            except Exception as e:
                print(str(e))
                return False
        return True
