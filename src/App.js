import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import NewsDashboard from './NewsDashboard';
import FavouriteList from './FavouriteList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<NewsDashboard />} />
        <Route path="/" element={<NewsDashboard />} />
        <Route path='/fav' element={<FavouriteList />} />
      </Routes>
    </Router>
  );
};

export default App;
