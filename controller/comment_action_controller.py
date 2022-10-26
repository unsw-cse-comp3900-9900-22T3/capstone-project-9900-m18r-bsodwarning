from dao.mysql_server import MysqlServer
from dao.entity.comment import Comment

# 初始化数据表
comment = Comment()


class CommentAction():
    def __init__(self) -> None:
        self.comment_sql_session = MysqlServer().get_comment_session()
    
    def addComment(self, comment):
        try:
            self.comment_sql_session.add(comment)
            self.comment_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True
   