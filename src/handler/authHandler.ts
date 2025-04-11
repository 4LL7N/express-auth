import { Request,Response } from "express"
import { comparePassword, hashPassword, signToken } from "../modules/auth"
import prisma from "../prismaDB"
import { UserType } from "../../types/auth"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const login = async (req:Request,res:Response)=>{
    const {username,password} = req.body
    try{
        const user = await prisma.user.findUnique({
            where:{
                username
            }
        })
        if(!user){
            res.status(404).json({
                status:"fail",
                message:"no user found"
            })
            return
        }
        const isValidPassword = comparePassword(password,user.password)

        if(!isValidPassword){
            res.json(401).json({
                status:"fail",
                message:"invalid credentials"
            })
            return
        }

        const token = signToken(
            {
                username:user.username,
                email:user.email,
                password:user.password
            }
        )

        res.status(200).json({
            status:"succes",
            token
        })

    }catch(err){
        if(err instanceof PrismaClientKnownRequestError){
            res.status(401).json({
                status: "fail",
                message:"invalid vredentials"
              });
        }
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        })
    }

}

export const register =  async (req:Request,res:Response)=>{
    const {username,email,password,name,lastname,phoneNumber}:UserType = req.body

    const newUser:UserType = {
        username,
        email,
        password:await hashPassword(password)
    }

    if (name) newUser.name = name;
    if (lastname) newUser.lastname = lastname;
    if (phoneNumber) newUser.phoneNumber = phoneNumber;

    try{

    const user = await prisma.user.create({
        data:newUser
    });

    const token = signToken({
        username: user.username,
        email: user.email ,
        password: user.password
    })

    res.status(201).json({
        status:"succes",
        message:"new user created",
        user,
        token
    })

    }catch(err){
        if(err instanceof PrismaClientKnownRequestError){
            res.status(400).json({
                status:"fail",
                message:"user alredy exists"
            })
        }
        res.status(500).json({
            status:"fail",
            message:"Internal server error"
        })
    }


}