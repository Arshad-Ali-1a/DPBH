from langchain.chains import GraphQAChain
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFaceHub
from langchain.indexes import GraphIndexCreator


model_id = "mistralai/Mistral-7B-Instruct-v0.1"
huggingFaceToken = "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"

mistral_llm = HuggingFaceHub(
    huggingfacehub_api_token=huggingFaceToken, repo_id=model_id
)

index_creator = GraphIndexCreator(llm=mistral_llm)


def get_file_content(file_path):
    with open(file_path) as f:
        all_text = f.read()
    return all_text


def make_graph(all_text):
    graph = index_creator.from_text(all_text)
    return graph


def generate(question, file_path):
    all_text = get_file_content(file_path)
    # return all_text
    graph = make_graph(all_text)
    chain = GraphQAChain.from_llm(mistral_llm, graph=graph, verbose=True)
    prompt= f"""<s>[INST] {question} [/INST] </s>[INST]Explain the reason behind the answer you give[/INST]"""

    return chain.run(prompt).split("\n\n")[0]
