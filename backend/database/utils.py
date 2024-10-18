import os

import psycopg2
from dotenv import load_dotenv
import json

load_dotenv()


class Database:
    def __init__(self):
        self.dbname = os.getenv("DB_NAME")
        self.host = os.getenv("DB_HOST")
        self.user = os.getenv("DB_USER")
        self.password = os.getenv("DB_PASS")

    def create_connection(self):
        dsn = f"dbname={self.dbname} user={self.user} password={self.password} host={self.host}"
        return psycopg2.connect(dsn)

    @staticmethod
    def close_connection(connection):
        connection.close()


def populate_transactions():
    with open('transactions.json', 'r') as file:
        records = json.load(file)

    conn = psycopg2.connect(
        dbname = os.getenv("DB_NAME"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASS"),
        host = os.getenv("DB_HOST"),
        port = os.getenv("DB_PORT")
    )

    cur = conn.cursor()

    for record in records:
        cur.execute("""
            INSERT INTO transactions (recipient, sender, title, date, amount, currency_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """, (record['recipient'], record['sender'], record['title'], record['date'], record['amount'], record['currency_id']))

    conn.commit()
    cur.close()
    conn.close()

def populate_currency():
    with open('currencies.json', 'r') as file:
        records = json.load(file)

    conn = psycopg2.connect(
        dbname = os.getenv("DB_NAME"),
        user = os.getenv("DB_USER"),
        password = os.getenv("DB_PASS"),
        host = os.getenv("DB_HOST"),
        port = os.getenv("DB_PORT")
    )

    cur = conn.cursor()

    for record in records:
        cur.execute("""
            INSERT INTO currency (curr)
            VALUES (%s)
            ON CONFLICT DO NOTHING;
        """, (record['curr'],))

    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    populate_currency()
    populate_transactions()