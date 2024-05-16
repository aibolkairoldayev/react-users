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
    skills: user?.skills || [''],
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

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleAddSkill = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      skills: [...prevFormData.skills, '']
    }));
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSave = () => {
    // Validation for required fields and email format
    if (!formData.name.trim()) {
      alert('Имя является обязательным');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email является обязательным');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Введите корректный формат email');
      return;
    }

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
        <label>Навыки:</label>
        {formData.skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <input
              type="text"
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveSkill(index)}>Удалить</button>
          </div>
        ))}
        <button type="button" onClick={handleAddSkill}>Добавить навык</button>
      </div>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
}

export default Form;
