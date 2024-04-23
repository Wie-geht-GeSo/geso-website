import requests
import weaviate
import subprocess
import time
import os
from dotenv import load_dotenv

load_dotenv()

client = weaviate.Client(
    url=os.getenv("WEAVIATE_URL"),
)


class_obj = {
    "class": "Page",
    "vectorizer": "text2vec-transformers",  # If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
    "moduleConfig": {
        "text2vec-transformers": {},
    },
    "properties": [
        {
            "dataType": ["text"],
            "description": "The title",
            "moduleConfig": {
                "text2vec-transformers": {"skip": False, "vectorizePropertyName": False},
                "reranker-cohere": {
                    "model": "rerank-multilingual-v2.0",
                },
            },
            "name": "title",
            "tokenization": "lowercase",
        },
        {
            "dataType": ["text"],
            "description": "The subtitle",
            "moduleConfig": {
                "text2vec-transformers": {"skip": False, "vectorizePropertyName": False},
                "reranker-cohere": {
                    "model": "rerank-multilingual-v2.0",
                },
            },
            "name": "subTitle",
            "tokenization": "lowercase",
        },
        {
            "dataType": ["text"],
            "description": "The slug",
            "moduleConfig": {
                "text2vec-transformers": {"skip": True, "vectorizePropertyName": False}
            },
            "name": "slug",
            "tokenization": "field",
        },
        {
            "dataType": ["text"],
            "description": "The embedded content",
            "moduleConfig": {
                "text2vec-transformers": {
                    "skip": False,
                    "vectorizePropertyName": False,
                },
                "reranker-cohere": {
                    "model": "rerank-multilingual-v2.0",
                },
            },
            "name": "aiContent",
            "tokenization": "lowercase",
        },
    ],
}


client.schema.delete_class("Page")
client.schema.create_class(class_obj)


directus_url=os.getenv("DIRECTUS_URL")
response = requests.get(
    url=f"{directus_url}/items/pages?fields=id,slug,title,subTitle,aiContent"
)
data = response.json().get("data", [])

subprocess.run(["docker", "stop", "geso-website-directus-1"]) #free up resources for weaviate on weaker servers
time.sleep(30)
client.batch.configure(batch_size=5)  # Configure batch, keep small for weaker servers
with client.batch as batch:  # Initialize a batch process
    for i, d in enumerate(data):  # Batch import data
        print(f"importing page: {d['title']}")
        properties = {
            "aiContent": d["aiContent"],
            "slug": d["slug"],
            "title": d["title"],
            "subTitle": d["subTitle"],
        }
        batch.add_data_object(data_object=properties, class_name="Page")
time.sleep(30)
subprocess.run(["docker", "start", "geso-website-directus-1"])