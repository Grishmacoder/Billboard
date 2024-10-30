from django.urls import path

from my_app.consumers import NewConsumer    # noqa isort:skip

websocket_urlpatterns = [
    path("", NewConsumer.as_asgi())
]
