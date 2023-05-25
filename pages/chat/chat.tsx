// client/pages/chat.tsx

import React, { FC, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { TextField, Button } from "@mui/material";

const Chat: FC = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatHolderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _socket = io("http://localhost:3001");
    setSocket(_socket);

    _socket.on("connect", () => {
      console.log("socket connected");
    });

    _socket.on("message", (data: string) => {
      setChatMessages([...chatMessages, data]);
    });

    _socket.on("disconnect", () => {
      console.log("socket disconnected");
    });

    return () => {
      _socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // chatHolderRef를 이용하여 스크롤바를 자동으로 아래로 내리도록 설정
    if (chatHolderRef.current) {
      chatHolderRef.current.scrollTop = chatHolderRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const handleSendButtonClick = () => {
    socket && socket.emit("message", chatInput);
    setChatInput("");
  };

  return (
    <div>
      <div ref={chatHolderRef} style={{ height: "200px", overflowY: "auto" }}>
        {chatMessages.map((chatMessage, index) => (
          <div key={index}>{chatMessage}</div>
        ))}
      </div>
      <TextField
        label="메시지를 입력하세요."
        variant="outlined"
        value={chatInput}
        onChange={handleChatInput}
      />
      <Button variant="contained" onClick={handleSendButtonClick}>
        보내기
      </Button>
    </div>
  );
};

export default Chat;
