import clip
from PIL import Image
import requests
from io import BytesIO
import pandas as pd
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
)
import torch
from transformers import AutoModel, AutoTokenizer, RobertaPreTrainedModel
from datasets import Dataset
from torch.utils.data import DataLoader
from tqdm import tqdm
from sklearn.preprocessing import normalize
import random
import numpy as np
from itertools import chain
from conf.dao_config import *

recipes = pd.read_csv("recipe/recipe.csv")

data = Dataset.from_pandas(recipes[["ingredients"]])

dataloader = DataLoader(data, batch_size=32)

tokenizer = AutoTokenizer.from_pretrained(simcse_recipe_ingredients_dir)
model = AutoModel.from_pretrained(simcse_recipe_ingredients_dir)
model.eval()

embedding = []
with torch.no_grad():
    for dataset in tqdm(dataloader):
        data_feature = tokenizer(dataset['ingredients'], padding="max_length", max_length=128, truncation=True,
                                 return_tensors="pt")
        data_embedding = model(**data_feature)
        embedding.append(data_embedding.pooler_output)

embedding = list(chain.from_iterable(embedding))
embedding = [i.detach().numpy() for i in embedding]

connections.connect("default", host=MILVUS_HOST, port="19530")

if utility.has_collection("COMP9900"):
    utility.drop_collection("COMP9900", timeout=None, using='default')

fields = [
    FieldSchema(name="index", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=768)
]

schema = CollectionSchema(fields, "COMP9900")
hello_milvus = Collection("COMP9900", schema)

entity = [
    [i + 1 for i in range(len(embedding))],
    embedding]

insert_result = hello_milvus.insert(entity)

index_params = {
    "metric_type": "IP",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}

hello_milvus.create_index(
    field_name="embeddings",
    index_params=index_params
)

data = Dataset.from_pandas(recipes[["title"]])

dataloader = DataLoader(data, batch_size=32)

tokenizer = AutoTokenizer.from_pretrained(simcse_recipe_title_dir)
model = AutoModel.from_pretrained(simcse_recipe_title_dir)
model.eval()

embedding = []
with torch.no_grad():
    for dataset in tqdm(dataloader):
        data_feature = tokenizer(dataset['title'], padding="max_length", max_length=128, truncation=True,
                                 return_tensors="pt")
        data_embedding = model(**data_feature)
        embedding.append(data_embedding.pooler_output)

embedding = list(chain.from_iterable(embedding))
embedding = [i.detach().numpy() for i in embedding]

connections.connect("default", host=MILVUS_HOST, port="19530")

if utility.has_collection("recipe_title_search"):
    utility.drop_collection("recipe_title_search", timeout=None, using='default')

fields = [
    FieldSchema(name="index", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=768)
]

schema = CollectionSchema(fields, "recipe_title_search")
hello_milvus = Collection("recipe_title_search", schema)

entity = [
    [i + 1 for i in range(len(embedding))],
    embedding]

insert_result = hello_milvus.insert(entity)

index_params = {
    "metric_type": "IP",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}

hello_milvus.create_index(
    field_name="embeddings",
    index_params=index_params
)



model, preprocess = clip.load("ViT-B/32")

data = Dataset.from_pandas(recipes[["title"]])

dataloader = DataLoader(data, batch_size=64)

model.eval
embedding = []

with torch.no_grad():
    for dataset in tqdm(dataloader):
        inputs = clip.tokenize(dataset['title'])
        data_embedding = model.encode_text(inputs)
        embedding.append(data_embedding)

embedding = list(chain.from_iterable(embedding))

embedding = [i.detach().numpy() for i in embedding]

connections.connect("default", host="120.55.40.153", port="19530")

if utility.has_collection("recipe_image_search"):
    utility.drop_collection("recipe_image_search")

fields = [
    FieldSchema(name="index", dtype=DataType.INT64, is_primary=True),
    FieldSchema(name="embeddings", dtype=DataType.FLOAT_VECTOR, dim=embedding[0].shape[0])
]

schema = CollectionSchema(fields, "recipe_image_search")
hello_milvus = Collection("recipe_image_search", schema)

index_params = {
    "metric_type": "IP",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}

hello_milvus.create_index(
    field_name="embeddings",
    index_params=index_params
)

hello_milvus = Collection("recipe_image_search", schema)

entity = [
    [i + 1 for i in range(len(embedding))],
    embedding]

insert_result = hello_milvus.insert(entity)
