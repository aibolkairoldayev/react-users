import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

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
  const { control, handleSubmit, reset, setValue } = useForm<User>({
    defaultValues: {
      id: 0,
      name: '',
      surname: '',
      email: '',
      skills: [],
      date: new Date().toISOString(),
    }
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onSubmit = (data: User) => {
    onSave(data);
  };

  return (
    <div className="modal">
      <h2>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Имя:</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <input {...field} />}
          />
        </div>
        <div>
          <label>Фамилия:</label>
          <Controller
            name="surname"
            control={control}
            render={({ field }) => <input {...field} />}
          />
        </div>
        <div>
          <label>Email:</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <input type="email" {...field} />}
          />
        </div>
        <div>
          <label>Навыки:</label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value.join(', ')}
                onChange={(e) => field.onChange(e.target.value.split(', '))}
              />
            )}
          />
        </div>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </form>
    </div>
  );
};

export default Form;
