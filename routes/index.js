import { Router } from "express";
import book from "./book.js";

const router = Router();

router.use("/book", book);

export default router;