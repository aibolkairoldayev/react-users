import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUsers, addUser, updateUser, deleteUser } from '../usersSlice';
import Form from '../components/Form';
import { Link } from 'react-router-dom';
import Sort from '../components/Sort';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
  date: string;
}

const Home: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [sortType, setSortType] = useState<string>('alphabetical-asc');
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (users.length === 0) {
      axios.get<User[]>('https://8306efc93b20a953.mokky.dev/users')
        .then(response => {
          const formattedUsers = response.data.map(user => ({
            ...user,
            date: formatDate(user.date)
          }));
          dispatch(setUsers(formattedUsers));
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    }
  }, [dispatch, users.length]);
  

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
      user.date = formatDate(new Date().toISOString());
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
    <div>
      <h1 className="text-4xl text-center font-semibold">Список пользователей</h1>
      <div className="flex items-center">
        <button className="my-3 py-0.5 px-2 rounded bg-lime-500" onClick={handleAddNew}>Добавить нового пользователя</button>
        <Sort onSortChange={handleSortChange} />
        <div className="flex items-center">
            <div className="text-sm mr-2">Удалить по id</div>
            <input className="mr-3 input rounded p-1.5 h-6"
            type="number"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            placeholder="Введите ID"
            />
            <button className="rounded bg-red-500 py-0.5 px-2 h-6 flex items-center" onClick={handleDeleteById}>Удалить</button>
        </div>
      </div>
      <table className="my-4 table">
        <thead className="">
          <tr>
            <th className="p-1">ID</th>
            <th className="p-1">Имя</th>
            <th className="p-1">Фамилия</th>
            <th className="p-1">Email</th>
            <th className="p-1">Навыки</th>
            <th className="p-1">Дата регистрации</th>
            <th className="p-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {getSortedUsers().map(user => (
            <tr key={user.id}>
              <td className="p-1">{user.id}</td>
              <td className="p-1">{user.name}</td>
              <td className="p-1">{user.surname}</td>
              <td className="p-1">{user.email}</td>
              <td className="p-1">{user.skills ? user.skills.join(', ') : ''}</td>
              <td className="p-1">{user.date}</td>
              <td>
                <button className="rounded py-0.5 px-2 bg-amber-400 mr-3" onClick={() => handleEdit(user)}>Редактировать</button>
                <button className="rounded bg-red-500 py-0.5 px-2 mr-3" onClick={() => handleDelete(user.id)}>Удалить</button>
                <Link to={`/user/${user.id}`}><button className="bg-sky-500 py-0.5 px-2 rounded">Просмотр</button></Link>
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
          title={modalTitle}
        />
      )}
    </div>
  );
};

export default Home;
