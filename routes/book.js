import { Router } from "express";

import {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    getBookById
} from "../controllers/book/index.js";

const router = Router();

router.post("/", createBook);
router.get("/", getAllBooks);
router.delete("/:id", deleteBook);
router.put("/:id", updateBook);
router.get("/:id", getBookById);

export default router;