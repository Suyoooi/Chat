import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Box, Typography } from "@mui/material";

const Recipient = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const newSocket = io();

    // Connect to the socket server
    newSocket.connect();

    // Handle incoming messages
    newSocket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", my: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Recipient Chat
      </Typography>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </Box>
  );
};

export default Recipient;
