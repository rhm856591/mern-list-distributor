// client/src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/agents">Agents</Link>
      </li>
      <li>
        <Link to="/lists">Lists</Link>
      </li>
      <li>
        <a href="#!" onClick={onLogout}>
          Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <header className="header">
      <h1>
        <Link to="/">List Distributor</Link>
      </h1>
      <nav>{isAuthenticated ? authLinks : guestLinks}</nav>
    </header>
  );
};

export default Header;