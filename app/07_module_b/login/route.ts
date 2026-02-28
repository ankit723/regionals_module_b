import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req:NextRequest){
    try{
        const {passphrase} = await req.json();

        if(passphrase!=="admin"){
            return NextResponse.json({message:"Invalid Passphrase"}, {status:401})
        }

        const access_token = jwt.sign({user:"admin"}, process.env.JWT_KEY || "", {expiresIn: "7d"})

        return NextResponse.json({message:"Login Successful", access_token}, {status: 200})
    }catch(err: any){
        console.error(err)
        return NextResponse.json({message: "There is some internal server Error"}, {status: 500})
    }
}

