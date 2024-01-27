import streamlit as st
from utils_rachit import generate

file_name = "/Users/rachitdas/Desktop/KnowledgeGraph/dark_patterns.txt"

if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "How may I help you?"}
    ]

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])


# Function for generating LLM response
def generate_response(prompt_input, file):
    # Hugging Face Login
    response = generate(prompt_input, file)
    return response


# User-provided prompt
if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = generate_response(prompt, file_name)
            st.write(response)
    message = {"role": "assistant", "content": response}
    st.session_state.messages.append(message)
