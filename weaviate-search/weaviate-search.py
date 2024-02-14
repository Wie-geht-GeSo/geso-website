import requests
import weaviate
import json
from weaviate.gql.get import HybridFusion


client = weaviate.Client(
    url="http://localhost:8080",  # Replace with your endpoint
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
                "text2vec-transformers": {"skip": True, "vectorizePropertyName": False},
                "reranker-cohere": {
                    "model": "rerank-multilingual-v2.0",
                },
            },
            "name": "title",
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


response = requests.get(
    "http://localhost:8055/items/pages?fields=id,slug,title,aiContent"
)
data = response.json().get("data", [])


client.batch.configure(batch_size=100)  # Configure batch
with client.batch as batch:  # Initialize a batch process
    for i, d in enumerate(data):  # Batch import data
        print(f"importing page: {i+1}")
        properties = {
            "aiContent": d["aiContent"],
            "slug": d["slug"],
            "title": d["title"],
        }
        batch.add_data_object(data_object=properties, class_name="Page")


query = "Jugend"
response = (
    client.query.get("Page", ["title", "aiContent", "slug"])
    # .with_near_tex({"concepts": ["Jugendcoaching"]})
    .with_hybrid(
        query=query,
        fusion_type=HybridFusion.RELATIVE_SCORE, # Needed for autocut with hybrid
    )
    # .with_limit(10)
    .with_additional("score")
    .with_additional('rerank(property: "aiContent" query: "' + query + '") { score }') # Cohere Reranker with same query
    .with_autocut(2) # Autocut to only return the top results
    .do()
)

print(json.dumps(response, indent=4))
