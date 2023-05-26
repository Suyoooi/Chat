import { useEffect, useRef, useState } from "react";
import { TextField, Button, List, ListItem } from "@mui/material";
import { Client, IMessage } from "@stomp/stompjs";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<Client | null>(null);
  const subscription = useRef<any | null>(null);

  useEffect(() => {
    socket.current = new Client();

    socket.current.configure({
      brokerURL: "ws://192.168.10.183:8080/ws",
      onConnect: () => {
        console.log("성공했습니다");
        subscription.current = socket.current?.subscribe(
          "/topic/messages",
          (message) => {
            const receivedMessage = JSON.parse(message.body).content;
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
        );
      },
      onDisconnect: () => {
        subscription.current?.unsubscribe();
      },
    });

    socket.current.activate();

    return () => {
      subscription.current?.unsubscribe();
      socket.current?.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (message && socket.current?.connected) {
      socket.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({ content: message }),
      });
      setMessage("");
    }
  };

  return (
    <div>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>{msg}</ListItem>
        ))}
      </List>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </div>
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
