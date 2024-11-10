import { useState } from "react";
import ModalStaff from "../components/ModalStaff";
import TableStaff from "../components/TableStaff";

const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Pass isModalOpen to TableStaff to apply blur */}
      <TableStaff isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      {/* Pass state handlers to ModalStaff */}
      <ModalStaff isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default Staff;
