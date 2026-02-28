import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'

export function checkAdmin(req: NextRequest){
    const token = req.headers.get("Authorization")?.split("_")[1]

    if(!token){
        return false
    }

    const isAdmin = jwt.verify(token, process.env.JWT_KEY || "")
    if(isAdmin.user === "admin" ){
        return true
    }else{
        return false
    }
}