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
    <div className="my-3 mx-auto w-3/5 forma">
      <div className="text-2xl mb-3">{title}</div>
      <div className="form-content flex">
        <div className="form-left">
          <div className="form-item">
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
          <div className="form-item">
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
          <div className="form-item">
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
        </div>
        <div className="form-right">
          <div className="form-item">
          <div className="flex justify-center">
            <label className="mr-3">Навыки:</label>
            <div>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                />
                <button className="rounded bg-red-500 py-0.5 px-2 h-6 flex items-center ml-3" type="button" onClick={() => handleRemoveSkill(index)}>Удалить</button>
              </div>
            ))}
            </div>
          </div>
          <button className="py-0.5 px-2 mt-2 rounded bg-lime-500 h-6 flex items-center block mx-auto" type="button" onClick={handleAddSkill}>Добавить навык</button>
        </div>
        </div>        

      </div>
            
      <div className="flex justify-center mt-5">
        <button className="py-0.5 px-2 rounded bg-lime-500 mr-4" onClick={handleSave}>Сохранить</button>
        <button className="bg-sky-500 py-0.5 px-2 rounded" onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}

export default Form;
