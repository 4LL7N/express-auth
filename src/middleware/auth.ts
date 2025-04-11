import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"

declare module "express-serve-static-core"{
    interface Request{
        user:string|jwt.JwtPayload
    }
}

export const protect = (req:Request,res:Response,next:NextFunction) => {

    const bearer = req.headers.authorization

    if(!bearer || !bearer.startsWith("Bearer")){
        res.status(401).json({
            status:"fail",
            message:"no token provided"
        })
        return
    }

    const token = bearer.split(" ")[2]

    if(!process.env.JWT_SECRET){
        res.status(404).json({
            status:"fail",
            message:"no secret provided"
        })
        return
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)

    req.user = decode
    next()
}