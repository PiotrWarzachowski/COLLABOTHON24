FROM python:3.9-slim-buster

LABEL authors="Wojciech Fiolka <fiolkawojciech@gmail.com>"

ARG POETRY_VERSION=1.8.1

WORKDIR /app
COPY . /app

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH" \
    POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    ALEMBIC_INI_PATH=/app/alembic.ini

RUN apt-get update && apt-get install -y netcat

WORKDIR /app

RUN pip install poetry==${POETRY_VERSION}

COPY poetry.lock pyproject.toml ./

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN poetry install --no-root

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
