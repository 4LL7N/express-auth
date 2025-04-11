import bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"
import { UserType } from "../../types/auth"

export const hashPassword = (password:string) => {
    return bcrypt.hash(password,10)
}

export const comparePassword = (password:string,hash:string)=>{
    return bcrypt.compare(password,hash)
}

interface TokenUser extends UserType {
    id: string;
    createdAt: Date;
}

export const signToken = (user:{
    username:string,
    email:string,
    password:string
}) => {
    if(!process.env.JWT_SECRET){
        throw new Error("no jwt secret")
    }
    return jwt.sign(
        user
        ,process.env.JWT_SECRET
    )
}