const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  createComment,
  getAllComments,
  deleteComment,
  replyToComment,
  likeComment,
  likeCommentReply,
  deleteReply,
} = require("../controllers/commentController");

router.route("/").get(getAllComments);
router
  .route("/:postId")
  .post(authenticateUser, createComment)
  .get(getAllComments);
router
  .route("/:postId/:commentId")
  .delete(authenticateUser, deleteComment)
  .post(authenticateUser, replyToComment);
router.route("/:commentId/likeComment").patch(authenticateUser, likeComment);
router
  .route("/:commentId/:replyId/deleteComment")
  .delete(authenticateUser, deleteReply);
router
  .route("/:commentId/:replyId/likeComment")
  .patch(authenticateUser, likeCommentReply);

module.exports = router;
