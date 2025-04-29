// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home           from "./pages/Home";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import MyVideos       from "./pages/MyVideos";
import Account        from "./pages/Account";
import WatchHistory   from "./pages/WatchHistory";
import ChannelProfile from "./pages/ChannelProfile.jsx";
import Videos         from "./pages/Videos";
import UploadVideo    from "./pages/UploadVideo";
import VideoDetail    from "./pages/VideoDetail";
import Playlists      from "./pages/Playlists";
import CreatePlaylist from "./pages/CreatePlaylist";
import PlaylistDetail from "./pages/PlaylistDetail";
import EditVideo from "./pages/EditVideo.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Tweets         from "./pages/Tweets.jsx";
import CreateTweet    from "./pages/CreateTweet.jsx";
import Subscriptions  from "./pages/Subscriptions.jsx";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/my-videos"        element={<MyVideos />} />
        <Route path="/account"          element={<Account />} />
        <Route path="/history"          element={<WatchHistory />} />
        <Route path="/channel/:username" element={<ChannelProfile />} />
        <Route path="/videos"          element={<Videos />} />
        <Route path="/upload"          element={<UploadVideo />} />
        <Route path="/videos/:videoId" element={<VideoDetail />} />
        <Route path="/playlists"       element={<Playlists />} />
        <Route path="/playlists/new"   element={<CreatePlaylist />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
        <Route path="/videos/:videoId/edit" element={<EditVideo />} />
        <Route path="/liked" element={<LikedVideos />} />
        <Route path="/tweets" element={<Tweets />} />
        <Route path="/tweets/new" element={<CreateTweet />} />
        <Route path="/subscriptions" element={<Subscriptions/>} />
       </Routes>
    </Router>
  );
}
