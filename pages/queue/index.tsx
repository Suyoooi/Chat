import React, { useState } from "react";
import Mornitoring from "./monitoring";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleQueueClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-red-200">
        <main
          className="max-w-lg p-4 bg-white rounded-lg cursor-pointer shadow-"
          onClick={handleQueueClick}
        >
          <h1>Queue</h1>
        </main>
      </div>
      {modalOpen && <Mornitoring onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Home;
