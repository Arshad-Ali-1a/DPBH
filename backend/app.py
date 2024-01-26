from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import pickle as pk
import pandas as pd 
import numpy as np
from warnings import filterwarnings
filterwarnings('ignore')

app              = FastAPI()
model            = pk.load(open('./models/XGBoost_94.pkl', 'rb'))
tfidf_vectorizer = pk.load(open('./models/tfidf_vectorizer.pkl', 'rb'))

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

    return {"result": outputs, "count": counts}

@app.post("/classify_sentence")
async def json_input(data: dict):

    sentence_tfidf = tfidf_vectorizer.transform([data['sentence']])
    prediction = model.predict(sentence_tfidf)
    prediction = category_map[prediction[0]]
    confidence_score = round(np.max(model.predict_proba(sentence_tfidf)), 2) * 100

    return {"sentence": data['sentence'], "prediction": prediction, "confidence_score":  confidence_score}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)