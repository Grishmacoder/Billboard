import React, { useState } from "react";
import ReactPlayer from 'react-player/lazy'
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function App() {
  const [displayBill, setDisplayBill] = useState(false);
  const [play, setPlay] = useState(true);

  const { sendJsonMessage } = useWebSocket("ws://127.0.0.1:8000/");
  const { readyState } = useWebSocket("ws://127.0.0.1:8000/", {
    onOpen: () => {
      console.log("Connected!");
    },
    onClose: () => {
      console.log("Disconnected!");
    },
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "start":
          setDisplayBill(true);
          setPlay(true);
          break;
        case "stop":
          setDisplayBill(false);
          break;
        case "play":
          setPlay(true);
          break;
        case "pause":
          setPlay(false);
          break;
        default:
          console.log("Unknown message type!");
          break;
      }
    }
  });

  // eslint-disable-next-line
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

    return (
    <>
      {!displayBill ?
      <button
        className="bg-gray-300 px-3 py-1"
        onClick={() => {
          sendJsonMessage({
            type: "start"
          });
        }}
      >
        Start
      </button>
      :
      <>
          <button
            className="bg-gray-300 px-3 py-1"
            onClick={() => {
              sendJsonMessage({
                type: "stop"
              });
            }}
          >
            Stop
          </button>

          <button
            className="bg-gray-300 px-3 py-1"
            onClick={() => {
              sendJsonMessage({
                type: `${play ? "pause" : "play"}`,
              });
            }}
          >
            {play ? "pause" : "play"}
          </button>
      </>
      }

      <br/>

      {displayBill &&
         <ReactPlayer
            url="/videos/arcnet.io(7-sec).mp4"
            playing={play}
            width="100%"
            loop muted
         />
      }
    </>
    );
}