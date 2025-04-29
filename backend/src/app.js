import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//CORS permissions: perimssion to all origins to access the API
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. mobile apps, curl)
      if (!origin) return callback(null, true);

      // if origin ends with ".vercel.app" OR starts with "http://localhost:"
      const isVercelPreview = /\.vercel\.app$/.test(origin);
      const isLocalhostDev = origin.startsWith("http://localhost:");
      if (isVercelPreview || isLocalhostDev) {
        return callback(null, true);
      }

      // otherwise, block
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,                     // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Common middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import commentRouter from "./routes/comment.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

//routes

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorHandler)

export { app };
