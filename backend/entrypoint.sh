#!/bin/bash
set -e

while ! nc -z db 5432; do   
  sleep 0.1
done

alembic upgrade head

cd /app/database
python3 utils.py
cd ..

exec "$@"
