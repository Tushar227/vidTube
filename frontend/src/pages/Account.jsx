// src/pages/Account.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Account() {
  const [user, setUser]           = useState(null);
  const [form, setForm]           = useState({ fullname:"", email:"" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile]   = useState(null);
  const [passwords, setPasswords] = useState({ oldPassword:"", newPassword:"" });
  const [message, setMessage]     = useState("");
  const [error, setError]         = useState("");
  const navigate                  = useNavigate();

  useEffect(() => {
    api.get("/users/current-user")
      .then(res => {
        setUser(res.data.data);
        setForm({
          fullname: res.data.data.fullname,
          email:    res.data.data.email
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message));
  }, []);

  const handleChange        = e => setForm(f => ({...f,[e.target.name]:e.target.value}));
  const handlePasswordChange= e => setPasswords(p=>({...p,[e.target.name]:e.target.value}));

  const updateDetails = async e => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const res = await api.patch("/users/update-account", form);
      setMessage("Details updated");
      setUser(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message||err.message);
    }
  };

  const updateAvatar = async e => {
    e.preventDefault();
    if (!avatarFile) return setError("Pick an avatar file");
    setError(""); setMessage("");
    const fd = new FormData();
    fd.append("avatar", avatarFile);
    try {
      const res = await api.patch("/users/avatar", fd, { headers:{"Content-Type":"multipart/form-data"} });
      setMessage("Avatar updated");
      setUser(res.data.data);
      setAvatarFile(null);
    } catch (err) {
      setError(err.response?.data?.message||err.message);
    }
  };

  const updateCover = async e => {
    e.preventDefault();
    if (!coverFile) return setError("Pick a cover file");
    setError(""); setMessage("");
    const fd = new FormData();
    fd.append("coverImage", coverFile);
    try {
      const res = await api.patch("/users/cover-image", fd, { headers:{"Content-Type":"multipart/form-data"} });
      setMessage("Cover updated");
      setUser(res.data.data);
      setCoverFile(null);
    } catch (err) {
      setError(err.response?.data?.message||err.message);
    }
  };

  const changePassword = async e => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.post("/users/change-password", passwords);
      setMessage("Password changed successfully");
      setPasswords({oldPassword:"", newPassword:""});
    } catch (err) {
      setError(err.response?.data?.message||err.message);
    }
  };

  const logout = async () => {
    await api.post("/users/logout");
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-5">Loading…</p>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Account Settings</h1>
      {error   && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Update Details */}
      <form onSubmit={updateDetails} className="mb-5">
        <h4>Update Details</h4>
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input name="fullname" className="form-control" value={form.fullname} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-primary">Save Details</button>
          </div>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={changePassword} className="mb-5">
        <h4>Change Password</h4>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Old Password</label>
            <input name="oldPassword" type="password" className="form-control" value={passwords.oldPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">New Password</label>
            <input name="newPassword" type="password" className="form-control" value={passwords.newPassword} onChange={handlePasswordChange} required />
          </div>
          <div className="col-12">
            <button className="btn btn-warning">Change Password</button>
          </div>
        </div>
      </form>

      {/* Update Avatar */}
      <form onSubmit={updateAvatar} className="mb-5">
        <h4>Update Avatar</h4>
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            <img src={user.avatar} alt="Avatar" className="rounded-circle" style={{ width: "80px", height: "80px", objectFit: "cover" }} />
          </div>
          <div className="col-md-6">
            <input type="file" accept="image/*" className="form-control" onChange={e => setAvatarFile(e.target.files[0])} />
          </div>
          <div className="col-auto">
            <button className="btn btn-secondary">Change Avatar</button>
          </div>
        </div>
      </form>

      {/* Update Cover */}
      <form onSubmit={updateCover} className="mb-5">
        <h4>Update Cover Image</h4>
        <div className="row g-3 align-items-center">
          <div className="col-auto">
            {user.coverImage && (
              <img src={user.coverImage} alt="Cover" className="rounded" style={{ width: "160px", height: "80px", objectFit: "cover" }} />
            )}
          </div>
          <div className="col-md-6">
            <input type="file" accept="image/*" className="form-control" onChange={e => setCoverFile(e.target.files[0])} />
          </div>
          <div className="col-auto">
            <button className="btn btn-secondary">Change Cover</button>
          </div>
        </div>
      </form>

      {/* Logout */}
      <div className="text-center mt-4">
        <button onClick={logout} className="btn btn-outline-danger">Logout</button>
      </div>
    </div>
  );
}
