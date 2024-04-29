const mongoose = require("mongoose");

//建立schema
const postSchemaObject = {
  name: {
    type: String,
    required: [true, "文章作者尚未填寫"],
  },
  tags: [
    {
      type: String,
      required: [true, "文章標籤尚未填寫"],
    },
  ],
  type: {
    type: String,
    required: [true, "文章類型尚未填寫"],
    enum: ["group", "person"],
  },
  image: {
    type: String,
    default: "",
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  content: {
    type: String,
    required: [true, "文章內容尚未填寫"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
};
const postSchema = new mongoose.Schema(postSchemaObject);
const Post = mongoose.model("posts", postSchema);

module.exports = Post;
