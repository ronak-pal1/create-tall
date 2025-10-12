import { Router } from "express";
import adminRoutes from "./v1/admin"
import userRoutes from "./v1/user"

const router = Router()

router.use("/admin", adminRoutes)
router.use("/",userRoutes)

export default router;