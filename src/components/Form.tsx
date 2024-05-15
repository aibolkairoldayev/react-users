import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
  date: string;
}

interface FormProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
  title: string;
}

const Form: React.FC<FormProps> = ({ user, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState<User>({
    id: user?.id || 0,
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    skills: user?.skills || [],
    date: user?.date || new Date().toISOString(),
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal">
      <h2>{title}</h2>
      <div>
        <label>
          Имя:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Фамилия:
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <div>
        <label>
          Навыки:
          <input
            type="text"
            name="skills"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(', ') })}
          />
        </label>
      </div>
      <div>
        <label>
          Дата регистрации:
          <input
            type="text"
            name="date"
            value={formData.date}
            readOnly
          />
        </label>
      </div>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
}

export default Form;
