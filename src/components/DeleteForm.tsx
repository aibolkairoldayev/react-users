import React, { useState } from 'react';

interface DeleteByIdProps {
  onDelete: (id: number) => void;
}

const DeleteById: React.FC<DeleteByIdProps> = ({ onDelete }) => {
  const [deleteId, setDeleteId] = useState<string>('');

  const handleDeleteById = () => {
    const id = Number(deleteId);
    if (!isNaN(id)) { 
      onDelete(id);
      setDeleteId('');
    } else {
      alert('Введите корректный ID');
    }
  };

  return (
    <div>
      <h2>Удалить по ID</h2>
      <input
        type="number"
        value={deleteId}
        onChange={(e) => setDeleteId(e.target.value)}
        placeholder="Введите ID"
      />
      <button onClick={handleDeleteById}>Удалить</button>
    </div>
  );
}

export default DeleteById;
