import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="text-center p-4">
        <h1 className="display-4 mb-3">Welcome to vidTube</h1>
        <p className="lead mb-4">
          A YouTube‑inspired video platform demo.  
          Please login or register to continue.
        </p>
        <Link to="/login" className="btn btn-primary me-2">
          Login
        </Link>
        <Link to="/register" className="btn btn-success">
          Register
        </Link>
      </div>
    </div>
  );
}
