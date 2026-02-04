import express from "express";
import {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostBySlug
} from "./journal.controller.js";
import { admin, protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/")
    .get(getAllPosts) // Public listing
    .post(protect, admin, createPost); // Admin only

router.route("/:id")
    .patch(protect, admin, updatePost) // Admin only
    .delete(protect, admin, deletePost); // Admin only

router.route("/slug/:slug")
    .get(getPostBySlug); // Public single post

export default router;
