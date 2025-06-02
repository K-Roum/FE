import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header'; 
import Footer from './components/common/footer';
import './i18n/index.js';

// Import page components
import HomePage from './pages/Home/HomePage.jsx';
import LandingPage from './pages/LandingPage';
import LanguageSelect from './pages/LanguageSelect';
import SearchPage from './pages/Home/SearchPage.tsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import FindAccountPage from './pages/Login/FindAccountPage.jsx';
import FindIdPage from './pages/Login/FindIdPage.jsx';
import ResetPasswordPage from './pages/Login/ResetPasswordPage.jsx';
import SignupPage from './pages/Signup/SignupPage.jsx';
import SignupCompletePage from './pages/Signup/SignupCompletePage.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/searchPage" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup-complete" element={<SignupCompletePage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;