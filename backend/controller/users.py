from fastapi import APIRouter, Query
from fastapi.templating import Jinja2Templates
from datetime import date
from database.users import User

router = APIRouter()
templates = Jinja2Templates(directory="database/view")

MONTH_NAMES = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


@router.get("/{u_id}")
async def get_users(u_id: int):
    user = User.get_by_id(u_id)
    return user.to_dict()


@router.post("/")
async def add_user(user: dict):
    new_user = User(user["name"], user["email"])
    new_user.save()
    return {"message": "User added successfully"}


@router.get("/tags/", summary="Get records and tags", description="Fetch records grouped by tag for a given date range.")
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
    records = User.get_records_by_date_range(from_date, to_date, key, type)

    tags = set(record["tag"] for record in records)
    grouped_records = {}

    if key == "year":
        for i in range(1, 13):
            grouped_records[i] = {}
            for tag in tags:
                grouped_records[i][tag] = 0

    for record in records:
        period = int(record["period"])
        tag = record["tag"]
        total = record["total"]

        grouped_records[period][tag] += total

    data = [
        {
            "period": MONTH_NAMES[period] if key == "year" else period,
            "transactions": transactions,
        }
        for period, transactions in grouped_records.items()
    ]

    return {
        "data": data,
        "labels": {f"{tag}": tag for tag in tags},
        "tags": [tag for tag in tags],
    }
