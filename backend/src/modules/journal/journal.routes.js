import express from "express";
import {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug
} from "./journal.controller.js";
import { admin, protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.route("/")
    .get(getAllPosts) // Public listing
    .post(protect, admin, upload.single('image'), createPost); // Admin only

router.route("/:id")
    .patch(protect, admin, upload.single('image'), updatePost) // Admin only
    .delete(protect, admin, deletePost); // Admin only

router.route("/slug/:slug")
    .get(getPostBySlug); // Public single post

export default router;
