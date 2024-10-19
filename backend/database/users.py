from database.utils import Database
from datetime import date
from typing import List


class Transaction:
    def __init__(self, recipient, sender, title, date, amount, currency_id):
        self.recipient = recipient
        self.sender = sender
        self.title = title
        self.date = date
        self.amount = amount
        self.currency_id = currency_id

    def to_dict(self):
        return {
            "recipient": self.recipient,
            "sender": self.sender,
            "title": self.title,
            "date": self.date,
            "amount": self.amount,
            "currency_id": self.currency_id,
        }

    @property
    def key(self):
        return self.tag


class User:
    def __init__(self, u_id: int, name: str):
        self.u_id = u_id
        self.name = name

    def to_dict(self):
        return {"u_id": self.u_id, "name": self.name}

    @staticmethod
    def get_by_id(u_id: int):
        return User(u_id, "John Doe")

    def save(self):
        raise NotImplementedError("Saving in database is not implemented yet.")

    @staticmethod
    def get_records_by_date_range(from_date: date, to_date: date, key: str, type: str):
        db = Database()
        conn = db.create_connection()
        cur = conn.cursor()

        query = """
        SELECT tag, 
               SUM(amount) AS total, 
        """

        if key == "day":
            query += "date::date AS period"
        elif key == "month":
            query += "EXTRACT(YEAR FROM date) AS period"
        elif key == "year":
            query += "EXTRACT(MONTH FROM date) AS period"
        else:
            raise ValueError("Invalid key, must be 'day', 'month', or 'year'")

        query += """
        FROM transactions_with_tag
        WHERE date BETWEEN %s AND %s
        """

        if type == "expenses":
            query += "AND amount < 0"
        elif type == "revenue":
            query += "AND amount > 0"
        elif type == "profit":
            pass
        else:
            raise ValueError("Invalid type, must be 'expenses', 'revenue', or 'profit'")

        query += """
        GROUP BY tag, period, date
        ORDER BY date ASC;
        """

        cur.execute(query, (from_date, to_date))
        records = cur.fetchall()

        cur.close()
        db.close_connection(conn)

        return [
            {
                "tag": record[0],
                "total": record[1],
                "period": record[2],
            }
            for record in records
        ]

    @staticmethod
    def get_recent_transactions_from_db() -> List[Transaction]:
        db = Database()
        conn = db.create_connection()
        cur = conn.cursor()

        query = """
        SELECT recipient, sender, title, date, amount, currency_id
        FROM transactions_with_tag
        ORDER BY date DESC
        LIMIT 5
        """

        cur.execute(query)
        records = cur.fetchall()

        cur.close()
        db.close_connection(conn)

        transactions = [
            Transaction(
                recipient=record[0],
                sender=record[1],
                title=record[2],
                date=record[3],
                amount=record[4],
                currency_id=record[5],
            )
            for record in records
        ]

        return transactions

    @staticmethod
    def get_all_tags() -> List[str]:
        db = Database()
        conn = db.create_connection()
        cur = conn.cursor()

        query = """
            SELECT tag
            FROM transactions_with_tag
            GROUP BY tag
        """

        cur.execute(query)
        records = cur.fetchall()

        cur.close()
        db.close_connection(conn)

        return [record[0] for record in records]
