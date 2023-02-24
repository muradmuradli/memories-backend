const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

const getAllPosts = async (req, res) => {
  const { title, tags } = req.query;

  const queryObject = {};

  if (title) {
    queryObject.title = { $regex: title, $options: "i" };
  }

  if (tags) {
    queryObject.tags = { $in: tags.split(",") };
  }

  let result = Post.find(queryObject);

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const posts = await result.sort({ createdAt: -1 });

  const totalPosts = await Post.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalPosts / limit);

  res.status(StatusCodes.OK).json({ posts, totalPosts, numOfPages });
};

const getSinglePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    throw new CustomError.NotFoundError(`No post found for ${id}`);
  }

  res.status(StatusCodes.OK).json({ post });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, tags } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    throw new CustomError.NotFoundError(`No post found for ${id}`);
  }

  const updatedPost = await Post.findOneAndUpdate(
    { _id: id },
    { title, message, tags },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ post: updatedPost });
};

const likePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById({ _id: id });
  if (!post) {
    throw new CustomError.NotFoundError(`No post with id ${id}`);
  }

  const index = post.likes.findIndex((id) => id.toString() === req.user.userId);

  if (index === -1) {
    post.likes.push(req.user.userId);
  } else {
    console.log("the id" + req.user.userId);
    post.likes = post.likes.filter((id) => id.toString() !== req.user.userId);
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ post: updatedPost });
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    throw new CustomError.NotFoundError(`No post found for ${id}`);
  }

  await post.remove();

  res.status(StatusCodes.OK).json({ msg: "Post deleted successfully" });
};

module.exports = {
  createPost,
  likePost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
};
