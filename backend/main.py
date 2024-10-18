from fastapi import FastAPI

from controller.main import router as main_router
from controller.users import router as users_router

app = FastAPI()

app.include_router(
    main_router,
    prefix="",
)
app.include_router(
    users_router,
    prefix="/users",
)
