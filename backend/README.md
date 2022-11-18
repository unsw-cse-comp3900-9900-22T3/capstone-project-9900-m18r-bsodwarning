# taste studio 

## before start backend

### Mysql build

#### Mysql install from docker 

```shell
docker pull mysql
docker run --name mysql -p 11013:3306 -e MYSQL_ROOT_PASSWORD=vMVUwaFri5KRqlUU -d mysql
```

### create database

在mysql中创建三个数据库

分别命名为`Commentinfo`,`recipeinfo`,`userinfo`

### Milvus install from docker

```shell
wget https://github.com/milvus-io/milvus/releases/download/v2.1.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
sudo docker-compose up -d
```

### pip install

```shell
pip install -r requirements.txt
pip install git+https://github.com/openai/CLIP.git
```

### download dataset

```shell
git lfs install
git clone https://huggingface.co/datasets/Shengtao/recipe
```

### start project

```shell
python server.py
```



这时候mysql和milvus是空的

需要将`upload2milvus.ipynb`和`upload2mysql.ipynb`的所有cell执行一遍。数据库中才会有数据。
