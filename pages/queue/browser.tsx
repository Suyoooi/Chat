import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";

interface ChatMessage {
  body: string;
}

const Browser = () => {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState("");

  const { apply_id } = useParams<{ apply_id: string }>();
  const client = useRef<StompJs.Client | null>(null);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://192.168.10.183:8080/ws",
      onConnect: () => {
        console.log("success");
        subscribe();
      },
    });
    client.current.activate();
  };

  const publish = (chat: string) => {
    if (!client.current?.connected) return;

    client.current.publish({
      destination: "/pub/sendMessage",
    });

    setChat("");
  };

  const subscribe = () => {
    client.current?.subscribe("/sub/1", (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      // setChatList((_chat_list) => [
      // ..._chat_list, json_body
      // ]);
    });
  };

  const disconnect = () => {
    client.current?.deactivate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 채팅 입력 시 state에 값 설정
    setChat(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent, chat: string) => {
    // 보내기 버튼 눌렀을 때 publish
    e.preventDefault();

    publish(chat);
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  return (
    <div>
      <div className="chat-list"></div>
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input
            type="text"
            name="chatInput"
            onChange={handleChange}
            value={chat}
          />
        </div>
        <input type="submit" value="의견 보내기" />
      </form>
    </div>
  );
};

export default Browser;
