from fastapi import FastAPI, File, UploadFile, Query, Form
from langchain_community.document_loaders import WebBaseLoader, TextLoader
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_community.embeddings import HuggingFaceInstructEmbeddings
from langchain_community.llms import HuggingFaceHub
import aiofiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
huggingFaceToken = "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"

mistral_llm = HuggingFaceHub(
    huggingfacehub_api_token=huggingFaceToken, repo_id=model_id,  model_kwargs={"temperature":0.1, "max_new_tokens":1024}
)

vector_store=None

app = FastAPI()

@app.get("/")
async def hello():
    return "Hello World"


@app.get('/anti-rachit/')
async def say_hello():
    return "This is the get function"

@app.post("/initialize_vector_db/")
async def initialize_vector_db(file: UploadFile = File(...)):
    global vector_store

    temp_file_path = f"temp_{file.filename}"

    # Save the uploaded file to disk
    async with aiofiles.open(temp_file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

    # Load and process data to update the vector store
    loader = TextLoader(temp_file_path, encoding='UTF-8')
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter()
    documents = text_splitter.split_documents(docs)

    embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-large")
    vector_store = FAISS.from_documents(documents, embeddings)

    return {"message": "Vector database initialized successfully"}


@app.post('/query_vector_db/')
async def query_vector_db(input: str = Form(...), url: str = Form(...)):
    if vector_store is None:
        return JSONResponse(content={"error": "Vector database is not initialized"}, status_code=400)

    retriever = vector_store.as_retriever()
    prompt = ChatPromptTemplate.from_messages([
        
        ("system", """<s>[INST]{input}[/INST]</s>[INST]This is the website that the user is on {url} and this is the HTML content of this website <context> {context} </context> None of the text that is within <context> brackets should be included in the final response. Assume that the user is already signed into the website. You are a Website Assistant Tool and your job is to understand the structure of a website from the HTML provided and give answers to users questions. You must always give a complete response. The questions can be based on navigation or can be based about the content of the website as given. YOUR ANSWER SHOULD ONLY CONSIST OF STEPS THAT THE USER CAN TAKE ON THE WEBSITE PROVIDED. ALWAYS PROVIDE COMPLETE STEPS AND DO NOT STOP IN BETWEEN.[/INST]"""),
        ("user", "I am already signed into this website please answer my question. {input}"),
        ])

    # Create a retrieval chain to answer questions
    document_chain = create_stuff_documents_chain(mistral_llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    response = retrieval_chain.invoke({"input": input, "url":url})
    ans=response['answer']
    output=ans.split("Assistant: ")[-1]
    print(output)
    
    return JSONResponse(content={"output": output})
    
