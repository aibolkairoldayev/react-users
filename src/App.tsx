import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Form from './components/Form';
import UserView from './UserView';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
  date: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

  useEffect(() => {
    axios.get<User[]>('https://8306efc93b20a953.mokky.dev/users')
      .then(response => {
        const formattedUsers = response.data.map(user => ({
          ...user,
          date: formatDate(user.date)
        }));
        setUsers(formattedUsers);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const handleDelete = (id: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    console.log('Deleting user with id', id);
  };

  const handleEdit = (user: User) => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentUser(user);
      setModalTitle('Редактировать пользователя');
      setIsModalOpen(true);
    }, 0);
  };

  const handleAddNew = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentUser(null);
      setModalTitle('Добавление нового пользователя');
      setIsModalOpen(true);
    }, 0);
  };

  const handleSave = (user: User) => {
    if (user.id) {
      setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...user, date: formatDate(user.date) } : u));
    } else {
      user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      user.date = new Date().toISOString();
      user.date = formatDate(user.date);
      setUsers(prevUsers => [...prevUsers, user]);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteById = () => {
    const id = parseInt(deleteId, 10);
    const user = users.find(user => user.id === id);
    if (user) {
      handleDelete(id);
    } else {
      alert('Пользователь с таким ID не найден');
    }
    setDeleteId('');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
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
                  <th>Дата регистрации</th>
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
                    <td>{user.date}</td>
                    <td>
                      <button onClick={() => handleEdit(user)}>Редактировать</button>
                      <button onClick={() => handleDelete(user.id)}>Удалить</button>
                      <Link to={`/user/${user.id}`}><button>Просмотр</button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <h2>Удалить по id</h2>
              <input
                type="number"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
                placeholder="Введите ID"
              />
              <button onClick={handleDeleteById}>Удалить</button>
            </div>
            {isModalOpen && (
              <Form 
                user={currentUser} 
                onSave={handleSave} 
                onCancel={handleCancel} 
                title={modalTitle}
              />
            )}
          </div>
        } />
        <Route path="/user/:id" element={<UserView users={users} />} />
      </Routes>
    </Router>
  );
}

export default App;
