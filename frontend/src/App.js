import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitIdea from './pages/SubmitIdea';
import IdeaDetail from './pages/IdeaDetail';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Contact from './pages/Contact';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './styles.css';

function App() {
  return (
    <Router>
      <Nav />
      <Chatbot />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-idea" element={<SubmitIdea />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;