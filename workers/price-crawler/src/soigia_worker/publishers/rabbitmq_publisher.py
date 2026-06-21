from soigia_worker.config.settings import settings


class RabbitMqPublisher:
    def publish(self, events: list[dict]) -> dict:
        return {
            "status": "pending",
            "url": settings.rabbitmq_url,
            "event_count": len(events),
        }
