# Configuration files related to database
user_info_db_name = "userinfo"  # Database related to user data
register_user_table_name = "register_user"  # table of registered user
user_likes_table_name = "user_likes"  # table of user likes
user_collections_table_name = "user_collections"  # table of user collections
user_read_table_name = "user_read"  # table of user read
exposure_table_name_prefix = "exposure"  # table of prefix for user 
user_subscribe_table_name = "user_subscribe"  # table of user subscribes

# comment db name
comment_db_name = "Commentinfo"
comment_table_name = "Comment"

# default configuration
mysql_username = "root"
mysql_passwd = "vMVUwaFri5KRqlUU"
mysql_hostname = "120.55.40.153"
mysql_port = "11013"



# material db name
material_db_name = "recipeinfo"
material_table_name = "recipe_detail"


# Milvus
MILVUS_HOST = "120.55.40.153"
MILVUS_PORT = "19530"
collection_name = "COMP9900"
index_type = "IVF_FLAT"
index_param = {
  "metric_type":"IP",
  "params":{"nlist":1024}
}
top_k = 10
search_param = {"metric_type": "IP", "params": {"nprobe": 10}}