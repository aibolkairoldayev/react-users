import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
}

interface UserViewProps {
  users: User[];
}

const UserView: React.FC<UserViewProps> = ({ users }) => {
  const { id } = useParams<{ id: string }>();
  const user = users.find(user => user.id === parseInt(id || '0', 10));
  const navigate = useNavigate();

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div>
      <h1>Просмотр пользователя</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Фамилия:</strong> {user.surname}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Навыки:</strong> {user.skills.join(', ')}</p>
      <button onClick={() => navigate('/')}>Все пользователи</button>
    </div>
  );
}

export default UserView;
