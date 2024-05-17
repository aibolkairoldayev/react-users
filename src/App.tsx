import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setUsers, addUser, updateUser, deleteUser } from './usersSlice';
import Form from './components/Form';
import UserView from './UserView';
import Sort from './components/Sort';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
  date: string;
}

const App: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [sortType, setSortType] = useState<string>('alphabetical-asc');

  useEffect(() => {
    axios.get<User[]>('https://8306efc93b20a953.mokky.dev/users')
      .then(response => {
        dispatch(setUsers(response.data));
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
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
      dispatch(updateUser(user));
    } else {
      user.id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
      user.date = new Date().toISOString();
      dispatch(addUser(user));
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

  const handleSortChange = (sortType: string) => {
    setSortType(sortType);
  };

  const getSortedUsers = () => {
    const sortedUsers = [...users];
    switch (sortType) {
      case 'alphabetical-asc':
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alphabetical-desc':
        sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sortedUsers;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto p-4">
            <h1>Список пользователей</h1>
            <button onClick={handleAddNew}>Добавить нового пользователя</button>
            <Sort onSortChange={handleSortChange} />
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
                {getSortedUsers().map(user => (
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
