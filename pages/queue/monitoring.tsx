import React from "react";
import { Button, Modal, TextField, Box, styled, Grid } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

interface SerialMessage {
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
const uuid = uuidv4();
const Monitoring = () => {
  const [open, setOpen] = useState(true);
  const [topicName, setTopicName] = useState("");
  const [count, setCount] = useState("");
  const [serialList, setSerialList] = useState<SerialMessage[]>([]);
  const [serial, setSerial] = useState("");

  const client = useRef<StompJs.Client | null>(null);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://192.168.10.55:8082/ws",
      onConnect: () => {
        console.log("success");
        subscribe();
      },
    });
    client.current.activate();
  };

  const publish = (topicName: string, serial: string, count: number) => {
    if (!client.current?.connected) return;

    const data = {
      topicName: topicName,
      serial: uuid,
      count: count,
    };

    console.log("Publishing data:", data);

    client.current.publish({
      destination: "/pub/sendMessage",
      body: JSON.stringify(data),
    });

    setSerial("");
    // subscribe();
  };

  const subscribe = () => {
    // console.log(uuid);
    console.log(topicName);
    const subscribeTopic = "/sub/" + uuid;
    console.log(subscribeTopic);
    client.current?.subscribe(subscribeTopic, (body) => {
      console.log(body.body);
    });
    console.log(subscribeTopic);
  };

  const disconnect = () => {
    client.current?.deactivate();
    console.log("error");
  };

  const handleSubmit = (
    e: React.FormEvent,
    topicName: string,
    serial: string,
    count: number
  ) => {
    e.preventDefault();
    console.log("topicName:", topicName);
    console.log("serial:", serial);
    console.log("count:", count);
    publish(topicName, serial, count);
  };

  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleStop = () => {
    // 중지 버튼 동작 추가
  };

  const handleTopicNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTopicName(event.target.value);
  };

  const handleSerialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSerial(event.target.value);
  };

  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(event.target.value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div>
        <div>
          {serialList.map((message, index) => (
            <div key={index}>{message.body}</div>
          ))}
        </div>
        <form
          onSubmit={(event) =>
            handleSubmit(event, topicName, serial, parseInt(count))
          }
        >
          <ModalWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Topic Name"
                  value={topicName}
                  onChange={handleTopicNameChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Serial"
                  value={serial}
                  onChange={handleSerialChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Count"
                  value={count}
                  onChange={handleCountChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}></Grid>
            <Grid container justifyContent="center" mt={2} spacing={2}>
              <Grid item>
                <Button type="submit" variant="outlined" color="success">
                  제출
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleStop}
                >
                  중지
                </Button>
              </Grid>
            </Grid>
          </ModalWrapper>
        </form>
      </div>
    </Modal>
  );
};

export default Monitoring;
