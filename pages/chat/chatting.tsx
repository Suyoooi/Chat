import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import io from "socket.io-client";
import { Container, Box, Grid, TextField, Button, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const socket = io("ws://192.168.10.183:8080/ws");

const theme = createTheme();

type Message = {
  id: number;
  text: string;
  username: string;
};

const Chatting = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("message", (msg: Message) => {
      console.log(`new message: ${JSON.stringify(msg)}`);
      setMessages((prevMessages) => [...prevMessages, msg]);
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);

  //   === Send Message ===
  const handleSendMessage = () => {
    const msg: Message = { id: messages.length, text: inputText, username };
    socket.emit("message", msg);
    setMessages((prevMessages) => [...prevMessages, msg]);
    setInputText("");
  };

  //   === Text ===
  const handleInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  //   === User Name ===
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  // === Keyboard Event ===
  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // === Message Clear ===
  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Chat</title>
      </Head>
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
              {/* === UserName === */}
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
              {/* === Message === */}
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
              {/* === Send Message === */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={handleSendMessage}
                      endIcon={<SendIcon />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                  {/* === Clear Message === */}
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

export default Chatting;
