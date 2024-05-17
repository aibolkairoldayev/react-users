import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
  date: string;
}

interface UserViewProps {
  users: User[];
}

const UserView: React.FC<UserViewProps> = ({ users }) => {
  const { id } = useParams<{ id: string }>();
  const user = users.find(user => user.id === parseInt(id || '', 10));
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-2xl text-center font-semibold">Пользователь не найден</div>;
  }

  return (
    <div>
      <h1 className="text-4xl text-center font-semibold">Просмотр пользователя</h1>
      <div className="text-2xl mt-3">{user.name} {user.surname}</div>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Навыки:</strong> {user.skills.join(', ')}</p>
      <p><strong>Дата регистрации:</strong> {user.date}</p>
      <button className="rounded py-0.5 px-2 bg-emerald-400 mt-4" onClick={() => navigate('/')}>На главную</button>
    </div>
  );
};

export default UserView;
