import { Router } from "express";

import {
    createBook,
    deleteBook,
    getAllBooks,
    getBookById,
    updateBook
} from "../controllers/book/index.js";

const router = Router();

// specifies functions to call for endpoints and corresponding methods
router.post("/", createBook);
router.delete("/:id", deleteBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);

export default router;