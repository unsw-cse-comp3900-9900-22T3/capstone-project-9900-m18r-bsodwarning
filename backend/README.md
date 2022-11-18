# taste studio 

## before start backend

### Mysql should be builded

#### Mysql should be installed from docker 

```shell
docker pull mysql
docker run --name mysql -p 11013:3306 -e MYSQL_ROOT_PASSWORD=vMVUwaFri5KRqlUU -d mysql
```

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

### Activate the program

Execute the following commands in turn:

```shell
python upload2mysql.py
python upload2milvus.py
python server.py
```
Note that uploading the data and converting it to vector will take some time
