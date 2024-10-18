import torch

from llm import _model, _tokenizer


def generate_embeddings(transactions):
    _all = [generate_embedding(t) for t in transactions]
    return _all


def generate_embedding(transaction: dict):
    """
    Generate embeddings from a transaction dictionary using a Hugging Face model.
    The output embedding is compatible with scikit-learn models like KNN.
    """
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
    mean_embedding = last_hidden_state.mean(dim=1).squeeze().numpy()
    return mean_embedding