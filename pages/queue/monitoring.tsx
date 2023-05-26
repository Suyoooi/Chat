import React from "react";
import { Button, Modal, TextField, Box, styled } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";

interface serialMessage {
  body: string;
}

const ModalWrapper = styled("div")`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Mornitoring = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState(true);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [list, setList] = useState<string[]>([]);
  const [serialList, setSerialList] = useState<serialMessage[]>([]);
  const [serial, setSerial] = useState("");

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
    client.current?.subscribe("/sub/", (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setSerialList((_serial_list) => [..._serial_list, json_body]);
    });
  };

  const disconnect = () => {
    client.current?.deactivate();
    console.log("error");
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

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleStart = () => {
    // 시작 버튼 동작 추가
    const topicName = "topic";
    const count = 4; // 예시로 input1 값을 사용
    publish(serial, topicName, count);
  };

  const handleStop = () => {
    // 중지 버튼 동작 추가
  };

  const handleInput1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput1(event.target.value);
  };

  const handleInput2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput2(event.target.value);
  };

  const handleInput3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput3(event.target.value);
  };

  const handleInput4Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput4(event.target.value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalWrapper>
        <div>
          <div className="flex gap-4 mb-4">
            <TextField
              label="Input 1"
              value={input1}
              onChange={handleInput1Change}
            />
            <TextField
              label="Input 2"
              value={input2}
              onChange={handleInput2Change}
            />
          </div>
          <div className="flex gap-4">
            <TextField
              label="Input 3"
              value={input3}
              onChange={handleInput3Change}
            />
            <TextField
              label="Input 4"
              value={input4}
              onChange={handleInput4Change}
            />
          </div>
        </div>

        <Box sx={{ maxHeight: 200, overflow: "auto", marginTop: "16px" }}>
          {/* 리스트 표시 영역 */}
          {list.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Box>
        <div className="serial-list">
          {serialList.map((message, index) => (
            <div key={index}>{message.body}</div>
          ))}
        </div>
        <form onSubmit={(event) => handleSubmit(event, "abc", "topic", 4)}>
          <div style={{ marginTop: "16px" }}>
            <input
              type="text"
              name="serialInput"
              onChange={handleChange}
              value={serial}
            />
            <button type="submit" value="의견 보내기">
              제출
            </button>
            {/* <Button
            value={serial}
            variant="contained"
            // onClick={handleStart}
            sx={{ marginRight: "8px" }}
            onSubmit={(event) => handleSubmit(event, "abc", "topic", 4)}
          >
            시작
          </Button> */}
            <Button variant="contained" onClick={handleStop}>
              중지
            </Button>
          </div>
        </form>
      </ModalWrapper>
    </Modal>
  );
};

export default Mornitoring;
