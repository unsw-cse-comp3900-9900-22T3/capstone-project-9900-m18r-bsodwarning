from pymilvus import Milvus, connections, Collection, utility
from conf.dao_config import MILVUS_HOST, MILVUS_PORT


class MilvusService(object):
    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        try:
            connections.connect(
                alias="default",
                host=MILVUS_HOST,
                port=MILVUS_PORT)
            if utility.has_collection(self.collection_name):
                self.milvus_collection = Collection(self.collection_name)
            self.milvus_collection.load()
        except (RuntimeError, ConnectionError) as err:
            print(err)

    def insert(self, vectors, ids):
        try:
            result = self.query_with_id(ids)
            if result == [[]] or result == []:
                entity = [
                    [ids],
                    [vectors[0]]
                ]
                self.milvus_collection.insert(entity)
                print('Insert success')
                return 1  # 1 means insert success
            print('Insert entities already exist')
            return 2  # 2 means index exists
        except Exception as e:
            print("Milvus insert error:", e)
            return 3  # 3 means Milvus insert error

    def delete_entity_by_id(self, ids):
        try:
            result = self.query_with_id(ids)
            if result:
                self.milvus_collection.delete(f"index in [{ids}]")
                return 1  # 1 means delete success
            return 2  # 2 means insert not exists
        except Exception as e:
            print('Milvus delete error: ', e)
            return 3  # 3 means Milvus delete error

    def search_with_embedding(self, data, metric_type="IP", topk=6):
        search_param = {"metric_type": metric_type, "params": {"nprobe": 10}}
        try:
            results = self.milvus_collection.search(
                data=data,
                anns_field="embeddings",
                param=search_param,
                limit=topk
            )
            return results
        except Exception as e:
            print('Milvus search_with_embedding error: ', e)

    def query_with_id(self, ids):
        try:
            res = self.milvus_collection.query(
                expr=f"index in [{ids}]",
                output_fields=["index", "embeddings"],
                consistency_level="Strong"
            )
            return res
        except Exception as e:
            print('Milvus query_with_id error: ', e)


if __name__ == '__main__':
    import random

    client = MilvusService()
    collection_name = 'COMP9900'
    ids = [13]
    # embeddings = [[random.random() for _ in range(128)] for _ in range(100)]
    # status, ids = client.search(
    #     collection_name=collection_name,
    #     vectors=embeddings,
    #     ids=ids)
    # print(status)
    # print(ids)
