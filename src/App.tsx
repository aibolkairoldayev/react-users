import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from './components/Form';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get<User[]>('https://8306efc93b20a953.mokky.dev/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDelete = (id: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    console.log('Deleting user with id', id);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleSave = (user: User) => {
    if (user.id) {
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? user : u));
    } else {
      user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prevUsers => [...prevUsers, user]);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>Список пользователей</h1>
      <button onClick={handleAddNew}>Добавить нового пользователя</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Email</th>
            <th>Навыки</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.skills ? user.skills.join(', ') : ''}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Редактировать</button>
                <button onClick={() => handleDelete(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <Form 
          user={currentUser} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}
    </div>
  );
}

export default App;
