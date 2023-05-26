import React, { useState } from "react";
import { Button, Modal, TextField, Box, styled } from "@mui/material";

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

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleStart = () => {
    // 시작 버튼 동작 추가
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

        <div style={{ marginTop: "16px" }}>
          <Button
            variant="contained"
            onClick={handleStart}
            sx={{ marginRight: "8px" }}
          >
            시작
          </Button>
          <Button variant="contained" onClick={handleStop}>
            중지
          </Button>
        </div>
      </ModalWrapper>
    </Modal>
  );
};

export default Mornitoring;
