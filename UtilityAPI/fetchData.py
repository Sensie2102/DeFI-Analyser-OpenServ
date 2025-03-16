import os
import requests
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document
import pymongo
import json
from dotenv import load_dotenv

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


UNISWAP_TOKEN_LIST_URL = "https://tokens.uniswap.org"

def fetchTokenData():
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/111.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(UNISWAP_TOKEN_LIST_URL,headers=headers)
    if not response.status_code == 200:
        print("Cannot connect")
    
    return response.json()

def formatData():
    tokens = fetchTokenData()
    
    token = tokens["tokens"]
    
    matches = []
    for tok in token:
        
        if tok["chainId"] == 1:
            
            matches.append({"name":tok["name"],"symbol": tok["symbol"],"address":tok["address"]})

    return matches

def addData(chunks):
    documents = [Document(page_content=json.dumps(chunk["name"]),metadata={
                "symbol": chunk["symbol"],
                "address": chunk["address"]
            }) for chunk in chunks]
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    
    collection = get_db()
    
    collection.delete_many({})
    
    
    

    docsearch = MongoDBAtlasVectorSearch.from_documents(
        documents, 
        embeddings, 
        collection=collection, 
        index_name="vector_index"
    )
    
if __name__ == "__main__":
    data = formatData()
    addData(data)
    

    