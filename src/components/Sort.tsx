import React from 'react';

interface SortProps {
  onSortChange: (sortType: string) => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  return (
    <div>
      <label htmlFor="sort">Сортировать по: </label>
      <select id="sort" onChange={(e) => onSortChange(e.target.value)}>
        <option value="alphabetical-asc">По алфавиту (А-Я)</option>
        <option value="alphabetical-desc">По алфавиту (Я-А)</option>
      </select>
    </div>
  );
};

export default Sort;
