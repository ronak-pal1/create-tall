import express from "express"
import router from "./routes";
import { config } from "./env.config";

const app = express();
const PORT = config.PORT

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.use("/api", router)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})