# 数据库相关的配置文件
user_info_db_name = "userinfo" # 用户数据相关的数据库
register_user_table_name = "register_user" # 注册用户数据表
user_likes_table_name = "user_likes" # 用户喜欢数据表
user_collections_table_name = "user_collections" # 用户收藏数据表
user_read_table_name = "user_read"   # 用户阅读数据表
exposure_table_name_prefix = "exposure" # 用户曝光数据表的前缀


# 默认配置
mysql_username = "root"
mysql_passwd = "comp9900"
mysql_hostname = "localhost"
mysql_port = "3306"

# MongoDB
mongo_hostname = "127.0.0.1"
mongo_port = 27017

# 物料池db name
material_db_name = "recipeinfo"
material_table_name = "recipe_detail"

#评论db name
comment_db_name = "Commentinfo"
comment_table_name = "Comment"

# log数据，每天都会落一个盘，并由时间信息进行命名
loginfo_db_name = "loginfo" # log数据库
loginfo_table_name_prefix = "log" # log数据表的前缀

# 特征画像 集合名称
feature_protrail_collection_name = "FeatureProtrail"
redis_mongo_collection_name = "RedisProtrail"
user_protrail_collection_name = "UserProtrail"

# Redis
redis_hostname = "127.0.0.1"
redis_port = 6379

reclist_redis_db_num = 0
static_news_info_db_num = 1
dynamic_news_info_db_num = 2
user_exposure_db_num = 3

