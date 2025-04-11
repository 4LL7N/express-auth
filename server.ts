import express from "express"
import moragn from "morgan"
import * as dotenv from "dotenv"

const app = express()

if(process.env.NODE_ENV == "development"){
    app.use(moragn("dev"))
}
app.use(express.json())
app.use(express.urlencoded({extended:true}))


export default app