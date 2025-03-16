from fastapi import FastAPI
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain.embeddings import HuggingFaceEmbeddings
import os
from dotenv import load_dotenv
import pymongo

app = FastAPI()

load_dotenv()

CONNECTION_STRING = os.getenv("MONGODB_CONNECTION_STRING")
DATABASE = os.getenv("DATABASE")
COLLECTION=os.getenv("COLLECTION")

def initialize_db():
    try:
        client = pymongo.MongoClient(CONNECTION_STRING)
        db = client[DATABASE]
        return db[COLLECTION]
    except ConnectionRefusedError:
        print("Connection with MongoDB server has been refused, try again.")
        
    
def get_db():
    collection = initialize_db()
    return collection

@app.get('/token')
def get_token_information(token: str):
    vectorStore = MongoDBAtlasVectorSearch(
    get_db(), HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"), index_name="token_search"
    )
    docs = vectorStore.max_marginal_relevance_search(token, 5)
    
    for doc in docs:
        print("page_content:", doc.page_content)
        print("metadata:", doc.metadata["symbol"])
        print("-" * 40)