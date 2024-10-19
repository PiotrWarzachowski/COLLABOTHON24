from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controller.main import router as main_router
from controller.users import router as users_router

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    main_router,
    prefix="",
)
app.include_router(
    users_router,
    prefix="/users",
)
