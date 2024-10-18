from fastapi import APIRouter
from fastapi.templating import Jinja2Templates

from backend.database.users import User

router = APIRouter()
templates = Jinja2Templates(directory="database/view")


@router.get("/{u_id}")
async def get_users(u_id: int):
    user = User.get_by_id(u_id)
    return user.to_dict()


@router.post("/")
async def add_user(user: dict):
    new_user = User(user["name"], user["email"])
    new_user.save()
    return {"message": "User added successfully"}
