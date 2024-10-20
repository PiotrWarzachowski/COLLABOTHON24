import json


def map_transaction(transaction: dict):
    with open("backend/database/currencies.json", "r") as f:
        currencies = json.load(f)
    currency = currencies[transaction["currency_id"] - 1]["curr"]
    who = f"{transaction['sender']} to {transaction['recipient']}"

    return {
        "who": who,
        "title": transaction["title"],
        "date": transaction["date"],
        "amount": transaction["amount"],
        "currency": currency,
    }
