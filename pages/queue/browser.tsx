import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";

interface serialMessage {
  body: string;
}

const Browser = () => {
  const [serialList, setSerialList] = useState<serialMessage[]>([]);
  const [serial, setSerial] = useState("");

  // const { topicName } = useParams<{ topicName: string }>();
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

  const publish = (serial: string, topicName: string, count: number) => {
    if (!client.current?.connected) return;

    client.current.publish({
      destination: "/pub/sendMessage",
      body: JSON.stringify({
        topicName: topicName,
        serial: serial,
        count: count,
      }),
    });
    setSerial("");
  };

  const subscribe = () => {
    client.current?.subscribe("/sub/1", (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setSerialList((_serial_list) => [..._serial_list, json_body]);
    });
  };

  const disconnect = () => {
    client.current?.deactivate();
    console.log("disconnected");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerial(e.target.value);
  };

  const handleSubmit = (
    e: React.FormEvent,
    serial: string,
    topicName: string,
    count: number
  ) => {
    e.preventDefault();
    publish(topicName, serial, count);
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  return (
    <div>
      <div className="serial-list">
        {serialList.map((message, index) => (
          <div key={index}>{message.body}</div>
        ))}
      </div>
      <form onSubmit={(event) => handleSubmit(event, "abc", "topic", 4)}>
        <div>
          <input
            type="text"
            name="serialInput"
            onChange={handleChange}
            value={serial}
          />
        </div>
        <input type="submit" value="의견 보내기" />
      </form>
    </div>
  );
};

export default Browser;
