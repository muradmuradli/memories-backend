const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");
const checkPermissions = require("../utils/checkPermissions");

const createComment = async (req, res) => {
  req.body.createdBy = req.user.userId;
  req.body.postId = req.params.postId;
  const user = await User.findOne({ _id: req.user.userId });
  req.body.name = user.name;
  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json({ comment });
};

const getAllComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ postId }).sort("-createdAt");
  res.status(StatusCodes.CREATED).json({ comments });
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });

  checkPermissions(req.user, comment.createdBy);

  await comment.delete();

  res.status(StatusCodes.NO_CONTENT).json({ msg: "comment deleted" });
};

const replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId });

  const reply = req.body;
  const user = await User.findOne({ _id: req.user.userId });
  reply.name = user.name;
  reply.replyTo = comment._id;
  reply.createdBy = user._id;

  comment.responses.push(reply);
  const responseComment = await comment.save();

  res.status(StatusCodes.OK).json({ comment: responseComment });
};

const likeComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  const index = comment.likes.findIndex(
    (id) => id.toString() === req.user.userId
  );

  if (index === -1) {
    comment.likes.push(req.user.userId);
  } else {
    console.log("the id" + req.user.userId);
    comment.likes = comment.likes.filter(
      (id) => id.toString() !== req.user.userId
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    comment,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ comment: updatedComment });
};

const likeCommentReply = async (req, res) => {
  const { commentId, replyId } = req.params;

  const comment = await Comment.findById({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  const reply = comment.responses.find(
    (response) => response._id.toString() === replyId
  );

  console.log(reply);

  const index = reply.likes.findIndex(
    (id) => id.toString() === req.user.userId
  );

  if (index === -1) {
    reply.likes.push(req.user.userId);
  } else {
    reply.likes = reply.likes.filter((id) => id.toString() !== req.user.userId);
  }

  comment.responses = comment.responses.map((response) =>
    response._id !== reply._id ? response : reply
  );

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    comment,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ comment: updatedComment });
};

const deleteReply = async (req, res) => {
  const { commentId, replyId } = req.params;

  const comment = await Comment.findById({ _id: commentId });
  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  const reply = comment.responses.find(
    (response) => response._id.toString() === replyId
  );

  const index = comment.responses.indexOf(reply);

  if (index > -1) {
    comment.responses.splice(index, 1); // 2nd parameter means remove one item only
  }

  comment.responses = comment.responses.map((response) =>
    response._id !== reply._id ? response : reply
  );

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    comment,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ comment: updatedComment });
};

module.exports = {
  createComment,
  getAllComments,
  deleteComment,
  replyToComment,
  likeComment,
  likeCommentReply,
  deleteReply,
};
