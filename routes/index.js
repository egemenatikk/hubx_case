import { Router } from "express";
import book from "./book.js";
import author from "./author.js";

const router = Router();

router.use("/author", author);
router.use("/book", book);

export default router;