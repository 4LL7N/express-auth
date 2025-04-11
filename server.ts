import express from "express"
import moragn from "morgan"
import * as dotenv from "dotenv"

import authRouter from "./src/router/authRouter"

const app = express()

if(process.env.NODE_ENV == "development"){
    app.use(moragn("dev"))
}
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRouter)

export default app