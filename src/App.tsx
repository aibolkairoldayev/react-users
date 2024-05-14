import React, { useState, useEffect } from 'react';
import axios from 'axios'

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Загрузка данных с сервера при монтировании компонента
    axios.get<User[]>('https://8306efc93b20a953.mokky.dev/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleDelete = (id: number) => {
    // Логика удаления пользователя
    console.log('Deleting user with id', id);
  };

  const handleEdit = (id: number) => {
    // Логика редактирования пользователя
    console.log('Editing user with id', id);
  };
  console.log(users)
  return (
    <div className="App">
      <h1>Список пользователей</h1>
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
                <button onClick={() => handleEdit(user.id)}>Редактировать</button>
                <button onClick={() => handleDelete(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
