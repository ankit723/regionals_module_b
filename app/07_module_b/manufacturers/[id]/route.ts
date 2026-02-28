import { checkAdmin } from "@/lib/checkAdmin"
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, {params}:{params:Promise<{id: string}>}){
    const {id} = await params;
    try {
        const isAdmin = checkAdmin(req);
        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const manufacturer = await prisma.manufacturer.findUnique({where:{id: parseInt(id)}})
        return NextResponse.json({...manufacturer})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}

export async function PUT(req:NextRequest, {params}:{params:Promise<{id: string}>}) {
    try {
        const {id} = await params;
        const isAdmin = checkAdmin(req)

        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        let body = await req.json();

        if(!body.id || !body.name || !body.active){
            return NextResponse.json({message: "Validation Error"}, {status: 400})
        }

        const updated_manufacturer = await prisma.manufacturer.update({
            where:{id: parseInt(id)},
            data:{
                id: parseInt(id),
                name:body.name,
                country:body.country,
                website: body.website?body.website:null,
                support_email: body.supportEmail?body.supportEmail:null,
                active: body.active
            }
        })

        return NextResponse.json("Manufacturer Updated", {status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}