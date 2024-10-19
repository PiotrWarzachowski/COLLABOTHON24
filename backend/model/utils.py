import json

import numpy as np
import torch

from llm import _model, _tokenizer


def map_transaction(transaction: dict):
    with open('backend/database/currencies.json', 'r') as f:
        currencies = json.load(f)
    currency = currencies[transaction["currency_id"] - 1]["curr"]
    who = f"{transaction['sender']} to {transaction['recipient']}"

    return {
        "who": who,
        "title": transaction["title"],
        "date": transaction["date"],
        "amount": transaction["amount"],
        "currency": currency
    }


def generate_embedding(transaction: dict):
    """
    Generate embeddings from a transaction dictionary using a Hugging Face model.
    The output embedding is compatible with scikit-learn models like KNN.
    """
    transaction = map_transaction(transaction)
    prompt = "Transaction: from-to: {who}, Title: '{title}', Transaction_date: '{date}', Amount: {amount}, Currency: {currency}"
    completed_prompt = prompt.format(
        who=transaction['who'],
        title=transaction['title'],
        date=transaction['date'],
        amount=transaction['amount'],
        currency=transaction['currency']
    )

    input_ids = _tokenizer.encode(completed_prompt, return_tensors='pt')

    with torch.no_grad():
        outputs = _model(input_ids=input_ids, output_hidden_states=True)

    last_hidden_state = outputs.hidden_states[-1]
    print(last_hidden_state.shape)
    mean_embedding = last_hidden_state.squeeze().numpy() / sum(last_hidden_state)
    return mean_embedding