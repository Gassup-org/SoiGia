from typing import Protocol


class CrawlResult(Protocol):
    source: str
    product_id: str
    collected_at: str


class BaseCrawler(Protocol):
    def collect(self) -> list[dict]:
        ...
