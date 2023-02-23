const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcrypt");
const app = express();

mongoose.connect(
  "mongodb://localhost:27017/users",
  {
    useNewUrlParser: true,
    useUndefinedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // save user and response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email });
    !user && res.status(404).send("User Not Found");
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(200).send("Wrong Password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//create post
app.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(err);
  }
});

//update post
app.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.id === req.body.id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

//delete a post
app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.id === req.body.id) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

//get all post
app.get("/post", async (req, res) => {
  const post = await Post.find({});
  try {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json("No Post");
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

app.listen(3000, () => {
  console.log("Backend Server Started");
});
