import React, { useState, useEffect } from "react";

const WebSocketForm = () => {
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    // 클라이언트에서만 실행되도록 분기 처리
    if (typeof window !== "undefined") {
      import("stompjs").then((Stomp) => {
        // WebSocket 연결 설정
        const socket = new window.SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
          // 구독 설정
          stompClient.subscribe("/topic/messages", (response: any) => {
            const received = JSON.parse(response.body);
            setReceivedMessage(received.content);
          });
        });

        return () => {
          // WebSocket 연결 종료
          stompClient.disconnect(() => {});
        };
      });
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // 클라이언트에서만 실행되도록 분기 처리
    if (typeof window !== "undefined") {
      import("stompjs").then((Stomp) => {
        // 메시지 전송
        const socket = new window.SockJS("http://localhost:8080/ws");
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
          const messageToSend = { content: message };
          stompClient.send(
            "/app/sendMessage",
            {},
            JSON.stringify(messageToSend)
          );
        });
      });
    }

    setMessage("");
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleMessageChange} />
        <button type="submit">전송</button>
      </form>

      <div>받은 메시지: {receivedMessage}</div>
    </div>
  );
};

export default WebSocketForm;
