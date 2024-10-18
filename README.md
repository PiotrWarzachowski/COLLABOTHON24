# COLLABOTHON24
Collabothon 2024 Repository

### Setup
#### Rename `.env.copy -> .env` and fill variables

#### Create a virtual environment and install the dependencies

```
cd backend/
poetry shell
poetry install
```

#### Build the Docker image and run the containers

```
docker compose up --build
```

#### Creating migrations
To create new migration simply run
```
alembic revision --autogenerate -m "example comment"
alembic upgrade head
```