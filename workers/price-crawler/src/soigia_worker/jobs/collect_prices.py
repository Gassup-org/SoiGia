from soigia_worker.crawlers.fuel_station import FuelStationCrawler
from soigia_worker.publishers.rabbitmq_publisher import RabbitMqPublisher


def collect_prices() -> dict:
    crawler = FuelStationCrawler()
    publisher = RabbitMqPublisher()

    events = crawler.collect()
    return publisher.publish(events)
