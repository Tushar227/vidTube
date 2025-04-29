// src/components/Navbar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          {/* Logo (favicon) */}
          <img
            src="/favicon.svg"
            alt="vidTube logo"
            width="30"
            height="30"
            className="me-2"
          />
          vidTube
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/videos">
                Videos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/liked">
                Liked Videos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/tweets">
                Tweets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/subscriptions" className="nav-link">
                Subscriptions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/upload">
                Upload
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/playlists">
                Playlists
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/my-videos">
                My Videos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/history">
                History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/account">
                Account
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
