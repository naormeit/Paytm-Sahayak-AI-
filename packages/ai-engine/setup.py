from setuptools import setup, find_packages

setup(
    name="ai_engine",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "google-genai",
        "pydantic"
    ],
    description="Core logic for Agentic Khata and Credit Analysis",
)
