from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import pickle as pk
import pandas as pd 
import numpy as np
from warnings import filterwarnings
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Rachit:6Q1dLzyyG8RnZWW2@cluster0.olun1qo.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi("1"))

db = client["Crowd_source"]
collection = db["patterns"]
print("Connected to database")


# retrieves the information from the database returns a dictionary with keys(domain_name, pattern, count) if document is found else returns None
def get_info(domain_name):
    try:
        document = collection.find_one({"domain_name": domain_name})
        print("Retrieved the information")
        if document is None:
            return None
        return document
    except Exception as e:
        print(e)


# updates the database with the new patterns if found and the count
def update(domain_name, patterns):
    document = get_info(domain_name)
    previous_patterns = document["pattern"]
    previous_count = document["count"]
    print(previous_patterns, previous_count)
    new_count = (
        sum(
            [
                count
                for pattern, count in patterns.items()
                if pattern not in previous_patterns
            ]
        )
        + previous_count
    )
    print(new_count)
    try:
        collection.update_one(
            {"domain_name": domain_name},
            {
                "$addToSet": {"pattern": {"$each": list(patterns.keys())}},
                "$set": {"count": new_count},
            },
        )
        print("Updated the database")
    except Exception as e:
        print(e)


# inserts into the database the domain name and the patterns
def insert(domain_name, patterns):
    # print(collection.find_one({"domain_name":domain_name}))
    if collection.find_one({"domain_name": domain_name}) != None:
        update(domain_name, patterns)
        print("Already exists")
    else:
        count = sum(patterns.values())
        try:
            collection.insert_one(
                {
                    "domain_name": domain_name,
                    "pattern": list(patterns.keys()),
                    "count": count,
                }
            )
            print("Inserted into the database")
        except Exception as e:
            print(e)


filterwarnings('ignore')

dir_path = os.path.dirname(os.path.realpath(__file__))

app              = FastAPI()
model            = pk.load(open(os.path.join(dir_path, './models/xgboost-94.pkl'), 'rb'))
tfidf_vectorizer = pk.load(open(os.path.join(dir_path, './models/tfidf-vectorizer.pkl'), 'rb'))

# Category Map is based on LabelEncoder of XGboost model
category_map = {
    0: 'Forced Action',
    1: 'Misdirection',
    2: 'Not Dark Pattern',
    3: 'Obstruction',
    4: 'Scarcity',
    5: 'Sneaking',
    6: 'Social Proof',
    7: 'Urgency'
}

@app.get("/")
async def home():
    return {"message": "UI DarkPattern Detector"}

@app.post("/classify_texts")
async def json_input(data: dict):

    sentences = []

    url = data["my_url"]
    data=data['data']

    for tag in data.keys():
        if tag == 'img':
            continue

        for sentence in data[tag]:
            sen = sentence['text'].strip()
            sen = ' '.join(sen.split())
            sentences.append(sen)

    sentences = list(set(sentences))

    outputs = pd.DataFrame(columns = ['sentence', 'category'])

    for sentence in sentences:
        sentence_tfidf = tfidf_vectorizer.transform([sentence])
        prediction = model.predict(sentence_tfidf)
        confidence_score = round(np.max(model.predict_proba(sentence_tfidf)), 2) * 100
        new_row = {'sentence': sentence, 'category': category_map[prediction[0]], 'confidence_score': confidence_score}
        outputs = pd.concat([outputs, pd.DataFrame([new_row])], ignore_index=True)

    outputs = outputs[outputs['category'] != 'Not Dark Pattern']
    outputs = outputs.groupby('category')['sentence'].apply(list).to_dict()

    counts = {}

    for output in outputs.keys():
        counts[output] = len(outputs[output])

    insert(url, counts)

    return {"result": outputs, "count": counts}

@app.post("/classify_sentence")
async def json_input(data: dict):

    sentence_tfidf = tfidf_vectorizer.transform([data['sentence']])
    prediction = model.predict(sentence_tfidf)
    prediction = category_map[prediction[0]]
    confidence_score = round(np.max(model.predict_proba(sentence_tfidf)), 2) * 100
    return {"sentence": data['sentence'], "prediction": prediction, "confidence_score":  confidence_score}


@app.post("/searchResults")
async def json_input(data:dict):
    print(data)
    domain_name = data["hostname"]
    info = get_info(domain_name)
    if info is None:
        return {"message": "No results found"}
    return {"pattern": info["pattern"], "count": info["count"]}

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=False,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
