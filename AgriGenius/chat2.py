import os
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_KEY:
    raise RuntimeError("GROQ_API_KEY not found in .env file")

llm = ChatGroq(
    model_name="llama-3.1-8b-instant",
    temperature=0.1,
    max_tokens=512,
    groq_api_key=os.environ["GROQ_API_KEY"],
)

def setup_retrieval_qa(db):
    retriever = db.as_retriever(search_kwargs={"k": 3})

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
You are AgriGenius, an agriculture assistant.
Answer in simple words (max 100 words).
If unsure, say "Don't know."

Context:
{context}

Question:
{question}
"""
    )

    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=False,
        verbose=False,
    )
