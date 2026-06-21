FROM python:3.12-slim

WORKDIR /repo

COPY workers/price-crawler/pyproject.toml ./workers/price-crawler/pyproject.toml
COPY workers/price-crawler/README.md ./workers/price-crawler/README.md
COPY workers/price-crawler/src ./workers/price-crawler/src

WORKDIR /repo/workers/price-crawler
RUN pip install --no-cache-dir .

CMD ["python", "-m", "soigia_worker.main"]
