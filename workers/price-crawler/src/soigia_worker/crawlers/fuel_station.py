from datetime import datetime, UTC


class FuelStationCrawler:
    def collect(self) -> list[dict]:
        return [
            {
                "source": "fuel-station-demo",
                "product_id": "prod-2",
                "entries": [
                    {
                        "store_id": "petrolimex",
                        "store_name": "Petrolimex",
                        "price": 21980,
                        "currency": "VND",
                    }
                ],
                "collected_at": datetime.now(UTC).isoformat(),
            }
        ]
