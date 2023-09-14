import { Router } from "express";

import {
    createAuthor,
    deleteAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor
} from "../controllers/author/index.js";

const router = Router();

router.post("/", createAuthor);
router.delete("/:id", deleteAuthor);
router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", updateAuthor);

export default router;