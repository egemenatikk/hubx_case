import { Router } from "express";

import {
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
} from "../controllers/author/index.js";

const router = Router();

// specifies functions to call for endpoints and corresponding methods
router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);

export default router;