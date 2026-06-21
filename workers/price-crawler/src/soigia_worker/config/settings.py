from pydantic import BaseModel


class Settings(BaseModel):
    rabbitmq_url: str = "amqp://soigia:soigia@rabbitmq:5672"


settings = Settings()
