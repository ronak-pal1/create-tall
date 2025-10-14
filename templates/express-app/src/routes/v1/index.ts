import { Router } from "express";
import adminRoutes from "./admin"
import userRoutes from "./user"

const router = Router()

router.use("/admin", adminRoutes)
router.use("/",userRoutes)

export default router;