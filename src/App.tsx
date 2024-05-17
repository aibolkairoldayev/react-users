import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import UserView from './pages/UserView';
import { useSelector } from 'react-redux';
import { RootState } from './store';

const App: React.FC = () => {
  const users = useSelector((state: RootState) => state.users.users);

  return (
    <div className="container">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserView users={users} />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;