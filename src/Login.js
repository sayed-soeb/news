import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Ensure you import the 'auth' module correctly
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (res) => {
      navigate("/dashboard");
    })
    .catch((err) => {
        console.error('Login Error:', err.message);
    });
  };

  const handleSignup = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error('Signup Error:', err.message);
      });
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="daily-news-container">
      <h2 className="daily-news-title">Daily News</h2>
      <form className="daily-news-form">
        <label className="daily-news-label">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="daily-news-input"
        />

        <label className="daily-news-label">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="daily-news-input"
        />

        {isLogin ? (
          <button type="button" onClick={handleLogin} className="daily-news-button">
            Login
          </button>
        ) : (
          <button type="button" onClick={handleSignup} className="daily-news-button">
            Signup
          </button>
        )}

        <p onClick={toggleForm} className="toggle-form">
          {isLogin ? 'Don\'t have an account? Signup' : 'Already have an account? Login'}
        </p>
      </form>
    </div>
  );
};

export default Login;
