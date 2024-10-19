import os
import random
import re

import openai
from dotenv import load_dotenv


load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")


def format_transaction(transaction: dict) -> str:
    """
    Format a transaction dictionary into a human-readable string.
    :param transaction: Dictionary containing the transaction data
    :return: Formatted string representation of the transaction
    """
    return "\n".join([f"**{k}**: {v}" for k, v in transaction.items()])


def get_suggestion(transactions: list[dict], tags: list[str]) -> str | None:
    """
    Get a suggestion for a new transaction based on the existing transactions and tags.
    :param transactions: List of dictionaries containing the existing transactions
    :param tags: List of existing tags
    :return: A suggestion for a new transaction or None if no suggestion is generated
    """
    with open('/backend/suggestions/prompt_template.txt', 'r') as f:
        prompt_template = f.read()

    prompt = prompt_template.format(
        tags=", ".join(tags),
        transactions="\n".join([format_transaction(t) for t in transactions]),
    )

    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are very good accountant. You are responsible for giving financial advices. Please provide a info for the following transactions in format **info**: <info>. Write it without unnecessary details.",
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        max_tokens=100,
        temperature=0.4,
        n=1
    )

    res = re.search(r"info.*:?\s*(\w+)", response.choices[0].message.content)
    if res:
        return " ".join(res.group(0).split()[1:])
    else:
        return