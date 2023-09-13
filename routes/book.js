import { Router } from "express";

import {
    getAllBooks
} from "../controllers/book/index.js";

const router = Router();

router.post("/", getAllBooks);
router.get("/", getAllBooks);
router.delete("/:id", getAllBooks);
router.put("/:id", getAllBooks);
router.get("/:id", getAllBooks);

export default router;