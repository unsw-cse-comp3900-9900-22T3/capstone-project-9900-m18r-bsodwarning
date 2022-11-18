from dao.mysql_server import MysqlServer
from dao.entity.comment import Comment
from sqlalchemy.sql import func
# initialize data table
comment = Comment()


class CommentAction():
    def __init__(self) -> None:
        self.comment_sql_session = MysqlServer().get_comment_session()
    
    def addComment(self, comment):
        try:
            comment.curtime = func.now()
            self.comment_sql_session.add(comment)
            self.comment_sql_session.commit()
            # print(comment.commentid)
            return comment.commentid
        except Exception as e:
            print(str(e))
            return False
        return True
    def deleteCommentByCommentid(self,commentid):
        # print(commentid)
        try:
            comment.commentid = commentid
            test = self.comment_sql_session.query(Comment).filter(Comment.commentid == commentid).first()
            # print(test)
            self.comment_sql_session.delete(test)
            self.comment_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True
    
    def getCommentByRecipeid(self,recipeid):
        try:
            comment_list = self.comment_sql_session.query(Comment).filter(Comment.recipeid == recipeid).all()
            print(comment_list)
            # self.comment_sql_session.delete(test)
            # self.comment_sql_session.commit()
            return comment_list
        except Exception as e:
            print(str(e))
            return False
        return True