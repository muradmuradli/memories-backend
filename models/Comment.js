const mongoose = require("mongoose");

const CommentReply = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please provide message"],
  },
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  replyTo: {
    type: mongoose.Types.ObjectId,
    ref: "Comment",
    required: [true, "Please provide comment"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide creator"],
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const CommentSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Please provide message"],
    },
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide creator"],
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "Please provide post"],
    },
    responses: {
      type: [CommentReply],
      default: [],
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
