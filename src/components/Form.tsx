import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  skills: string[];
}

interface FormProps {
  user: User | null;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const Form: React.FC<FormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>({
    id: user?.id || 0,
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    skills: user?.skills || []
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      skills: value.split(',').map(skill => skill.trim())
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Фамилия:</label>
          <input type="text" name="surname" value={formData.surname} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Навыки:</label>
          <input type="text" name="skills" value={formData.skills.join(', ')} onChange={handleSkillsChange} />
        </div>
        <div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

export default Form;
