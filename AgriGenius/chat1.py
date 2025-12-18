import os
import requests
import PyPDF2
from itertools import chain
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings.sentence_transformer import SentenceTransformerEmbeddings

# Fetch content from website
def fetch_website_content(url):
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    return response.text

# Extract text from PDF
def extract_pdf_text(pdf_file):
    with open(pdf_file, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        return "\n".join(page.extract_text() or "" for page in reader.pages)

# Split text into chunks
def split_text(text, chunk_size=500, chunk_overlap=100):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)

# Initialize or load vector store
def initialize_vector_store(contents=None, persist_path="vector_db"):
    embedding_function = SentenceTransformerEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )

    # If DB already exists → load it
    if contents is None and os.path.exists(persist_path):
        return Chroma(
            persist_directory=persist_path,
            embedding_function=embedding_function
        )

    # Otherwise → create new DB
    all_chunks = []
    for content in contents:
        all_chunks.extend(split_text(content))

    db = Chroma.from_texts(
        texts=all_chunks,
        embedding=embedding_function,
        persist_directory=persist_path
    )

    db.persist()
    return db

