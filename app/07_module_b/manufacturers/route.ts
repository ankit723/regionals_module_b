import { checkAdmin } from "@/lib/checkAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const isAdmin = checkAdmin(req);
        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const manufacturers = await prisma.manufacturer.findMany()
        return NextResponse.json(manufacturers)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}

export async function POST(req:NextRequest) {
    try {
        const isAdmin = checkAdmin(req)

        
        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        let {id, name, country, website, supportEmail, active} = await req.json();
        
        if(!id || !name || !active){
            return NextResponse.json({message: "Validation Error"}, {status: 400})
        }

        const manufacturer = await prisma.manufacturer.create({
            data:{
                id,
                name,
                country,
                website: website?website:null,
                support_email: supportEmail?supportEmail:null,
                active
            }
        })
        
        return NextResponse.json("Maanufacturer Created", {status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}


