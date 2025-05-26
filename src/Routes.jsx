import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header'; 
import './i18n/index.js';

// Import page components
import HomePage from './pages/Home/HomePage.jsx';
import LandingPage from './pages/LandingPage';
import LanguageSelect from './pages/LanguageSelect';
import SearchPage from './pages/Home/SearchPage.tsx';
const AppRoutes = () => {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/searchPage" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;