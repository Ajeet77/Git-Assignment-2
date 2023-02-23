const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  img: {
    type: String,
  },
  user: {
    type: String,
  },
},{timestamps:true}
);
const Post = mongoose.model('post',postSchema)
module.exports = Post