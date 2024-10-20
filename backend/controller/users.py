from datetime import date, datetime

from database.users import User
from fastapi import APIRouter, HTTPException, Query
from fastapi.templating import Jinja2Templates
from model import Model

router = APIRouter()
templates = Jinja2Templates(directory="database/view")

MONTH_NAMES = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]
tags = User.get_all_tags()
model = Model(tags)


@router.get("/{u_id}")
async def get_users(u_id: int):
    user = User.get_by_id(u_id)
    return user.to_dict()


@router.post("/")
async def add_user(user: dict):
    new_user = User(user["name"], user["email"])
    new_user.save()
    return {"message": "User added successfully"}


@router.get(
    "/tags/",
    summary="Get records and tags",
    description="Fetch records grouped by tag for a given date range.",
)
async def get_records(
    from_date: date = Query(...),
    to_date: date = Query(...),
    key: str = Query(..., description="Group by 'day', 'month', or 'year'"),
    type: str = Query(
        ..., description="Type can be 'expenses', 'revenue', or 'profit'"
    ),
):
    """
    Fetch records and tags within the specified date range, grouped by the specified period (day, month, or year).

    - **from_date**: The start date of the range.
    - **to_date**: The end date of the range.
    - **key**: The period to group by ('day', 'month', or 'year').
    - **type**: The type of records to fetch ('expenses', 'revenue', or 'profit').
    """

    num_days = (to_date - from_date).days

    if key == "day" and num_days > 14:
        raise HTTPException(
            status_code=400, detail="You can't choose more than 14 days in day mode."
        )

    records = User.get_records_by_date_range(from_date, to_date, key, type)

    if type == "profit":
        test = ["Income", "Expenses"]
        tags = set(r for r in test)
    else:
        tags = set(record["tag"] for record in records)
    grouped_records = {}

    if key == "year":
        for i in range(1, 13):
            grouped_records[i] = {}
            for tag in tags:
                grouped_records[i][tag] = 0
    elif key == "day":
        for record in records:
            record_date = str(
                str(datetime.strptime(str(record["period"]), "%Y-%m-%d"))[5:10]
            )
            record["period"] = record_date
            grouped_records[record_date] = {}
            for tag in tags:
                grouped_records[record_date][tag] = 0

    for record in records:
        if key == "day":
            period = record["period"]
        else:
            period = int(record["period"])
        tag = record["tag"]
        total = record["total"]

        if type == "profit":
            tag = "Income" if total > 0 else "Expenses"

        grouped_records[period][tag] += total

    for record in records:
        if key == "day":
            period = record["period"]
        else:
            period = int(record["period"])
        tag = record["tag"]
        total = record["total"]

        if type == "profit":
            tag = "Income" if total > 0 else "Expenses"

        grouped_records[period][tag] = abs(grouped_records[period][tag])

    if key == "year":
        data = [
            {
                "period": MONTH_NAMES[period],
                "transactions": transactions,
            }
            for period, transactions in grouped_records.items()
        ]
    elif key == "day":
        data = [
            {
                "period": period,
                "transactions": transactions,
            }
            for period, transactions in grouped_records.items()
        ]

    if key == "year":
        m = from_date.month
        data = data[m:] + data[:m]

    return {
        "data": data,
        "labels": {f"{tag}": tag for tag in tags},
        "tags": [tag for tag in tags],
    }


@router.get(
    "/transactions",
)
async def get_recent_transactions():
    """
    Fetch the all transactions from the database.

    Returns:
    - **transactions**: A list of all transactions.
    """
    try:
        transactions = User.get_all_transactions_from_db()

        return {"transactions": [transaction.to_dict() for transaction in transactions]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/generate/tag",
    summary="Generate a tag for given transaction",
    description="Generate a tag for a given transaction.",
)
async def generate_tag(transaction: dict):
    """
    Generate a tag for a given transaction.

    Returns:
    - **tag**: The generated tag.
    """
    return {"tag": model.get_tag(transaction)}


@router.post(
    "/generate/suggestion",
    summary="Generate a suggestion for a new transaction",
    description="Generate a suggestion for a new transaction based on existing transactions and tags.",
)
async def generate_suggestion(transactions: list[dict]):
    """
    Generate a financial suggestion for given transactions.

    Returns:
    - **suggestion**: The generated suggestion.
    """
    suggestion = generate_suggestion(transactions)
    return {"suggestion": suggestion}

@router.get("/tags")
async def get_tags():
    _tags = User.get_all_tags()
    return {"tags": _tags}
