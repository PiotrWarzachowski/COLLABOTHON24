import os
import random
import re

import openai
from dotenv import load_dotenv
from model.utils import map_transaction

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")


class Model:
    def __init__(self, tags: list[str]):
        """
        Initialize the model for embedding generation.
        :param tags: List of tags (labels) used for transactions
        """
        self.tags = tags

    def get_tag(self, transaction: dict) -> str:
        """
        Add a new transaction, generate its embedding, and store the transaction.
        :param transaction: Dictionary containing the transaction data
        :return: The predicted tag (label) for the given transaction
        """
        tag: str = self.predict(transaction)
        if tag not in self.tags:
            self.tags.append(tag)

        return tag

    def predict(self, transaction: dict) -> str:
        """
        Predict method for generating a label (or tag) based on a transaction.
        :param transaction: Dictionary containing the transaction data
        :return: The predicted tag (label) for the given transaction
        """
        prompt = self.format_prompt(transaction)

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are responsible for tagging this transaction. Please provide a tag for the following transaction in format **tag**: <tag>. Write it without unnecessary details.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            max_tokens=100,
            temperature=0.4,
            n=1,
        )

        tag = " ".join(
            re.search(r"tag.*:?\s*(\w+)", response.choices[0].message.content)
            .group(0)
            .split()[1:]
        )
        if tag:
            return tag
        else:
            return random.choice(self.tags)

    def format_prompt(self, transaction: dict) -> str:
        """
        Format the transaction data into a prompt for OpenAI API.
        :param transaction: Dictionary containing the transaction data
        :return: String prompt for embedding generation
        """
        with open("model/prompt_template.txt", "r") as f:
            prompt_template = f.read()
        transaction = map_transaction(transaction)
        prompt = prompt_template.format(
            tags=", ".join(self.tags),
            transaction="\n".join([f"**{k}**: {v}" for k, v in transaction.items()]),
        )
        return prompt


if __name__ == "__main__":
    _tags = [
        "office",
        "employees",
        "corporate meetings",
        "travel",
        "equipment",
        "marketing",
        "consulting",
    ]
    model = Model(_tags)

    _transaction = {
        "recipient": "Andrea English",
        "sender": "Taylor Jensen",
        "title": "Asset Acquisition Initiative",
        "date": "1977-01-13",
        "amount": 4001.04,
        "currency_id": 1,
    }

    _tag = model.get_tag(_transaction)
    print(_tag)
