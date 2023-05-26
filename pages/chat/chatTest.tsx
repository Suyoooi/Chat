import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  Container,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { Client, IMessage } from "@stomp/stompjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";

const theme = createTheme();

type Message = {
  id: number;
  text: string;
  username: string;
};

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useRef<Client | null>(null);

  // Connect to WebSocket server when component mounts
  useEffect(() => {
    socket.current = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: false,
      debug: (msg: any) => console.log(msg),
    });
    socket.current.activate();
    return () => {
      socket.current?.deactivate();
    };
  }, []);

  // Subscribe to "chat" topic and update state when a message is received
  useEffect(() => {
    if (socket.current?.connected) {
      socket.current.subscribe("/topic/chat", (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [socket.current?.connected]);

  // Send message to WebSocket server
  const sendMessage = () => {
    if (inputText && socket.current?.connected) {
      const message: Message = {
        id: messages.length + 1,
        text: inputText,
        username,
      };
      socket.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
      setInputText("");
    }
  };

  // Handle text input change
  const handleInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  // Handle username input change
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // Handle "enter" key press on message input field
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  // Clear chat messages
  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ height: "100vh" }}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }} component={Paper}>
            <Grid container direction="column" spacing={1} p={2}>
              {messages.map((msg) => (
                <Grid item key={msg.id}>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    color="success"
                    sx={{ borderRadius: 2, p: 1 }}
                  >
                    <strong>{msg.username}: </strong> {msg.text}
                  </Paper>
                </Grid>
              ))}
              <div ref={messagesEndRef} />
            </Grid>
          </Box>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Username input field */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  color="success"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Grid>
              {/* Message input field */}
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  color="success"
                  value={inputText}
                  inputRef={inputRef}
                  onChange={handleInputTextChange}
                  onKeyDown={handleInputKeyDown}
                />
              </Grid>
              {/* Send message button */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={sendMessage}
                      endIcon={<SendIcon />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                  {/* Clear chat button */}
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClearChat}
                      startIcon={<DeleteIcon />}
                    >
                      Clear Chat
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default function Home() {
  return (
    <div>
      <h1>Chat Room</h1>
      <ChatRoom />
    </div>
  );
}
