const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  createPost,
  likePost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const {
  createComment,
  getAllComments,
  deleteComment,
  replyToComment,
  likeComment,
  likeCommentReply,
  deleteReply,
} = require("../controllers/commentController");
const { uploadProductImage } = require("../controllers/uploadController");

router.route("/").post(authenticateUser, createPost).get(getAllPosts);
router.route("/upload").post(uploadProductImage);
router.route("/comments").get(getAllComments);
router
  .route("/comments/:postId")
  .post(authenticateUser, createComment)
  .get(getAllComments);
router
  .route("/comments/:postId/:commentId")
  .delete(authenticateUser, deleteComment)
  .post(authenticateUser, replyToComment);
router
  .route("/comments/:commentId/likeComment")
  .patch(authenticateUser, likeComment);
router
  .route("/comments/:commentId/:replyId/deleteComment")
  .delete(authenticateUser, deleteReply);
router
  .route("/comments/:commentId/:replyId/likeComment")
  .patch(authenticateUser, likeCommentReply);

router
  .route("/:id")
  .get(getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(deletePost);
router.route("/:id/likePost").post(authenticateUser, likePost);

module.exports = router;
