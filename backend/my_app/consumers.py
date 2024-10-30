from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync


class NewConsumer(JsonWebsocketConsumer):
    """
    This consumer is used to show user's online status,
    and send notifications.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None

    def connect(self):
        self.room_name = "home"
        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,
        )

    def disconnect(self, code):
        return super().disconnect(code)

    def receive_json(self, content, **kwargs):
        message_type = content["type"]
        if message_type == "start":
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "start",
                },
            )
        if message_type == "stop":
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "stop",
                },
            )
        if message_type == "play":
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "play",
                },
            )
        if message_type == "pause":
            async_to_sync(self.channel_layer.group_send)(
                self.room_name,
                {
                    "type": "pause",
                },
            )

        return super().receive_json(content, **kwargs)

    def start(self, event):
        self.send_json(event)

    def stop(self, event):
        self.send_json(event)

    def play(self, event):
        self.send_json(event)

    def pause(self, event):
        self.send_json(event)
