import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//everytime we store a user we have to encrypt the password
//we use pre hook so that we encrypt the password just before saving the user in the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//we create a method to compare the password
userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password);
}

//If user successfully logs in, we generate a access token
userSchema.methods.generateAccessToken = function () {
  //short lived access JWT token
  return jwt.sign({ //header
    _id : this._id,
    email : this.email,
    username : this.username,
    fullname : this.fullname,
  },
  //secret
  process.env.ACCESS_TOKEN_SECRET,
  //expiry
  {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
)
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id : this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
)
}

export const User = mongoose.model("User", userSchema);
