import TableRooms from "../components/TableRooms";

import ModalRooms from "../components/ModalRooms";
import { useState } from "react";

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="overflow-x-auto">
      <TableRooms isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <ModalRooms isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default Rooms;
