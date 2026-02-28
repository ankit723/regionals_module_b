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
        const model = await prisma.model.findUnique({where:{id:parseInt(id)}})
        return NextResponse.json({...model})
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

        const updated_model = await prisma.model.update({
            where:{id:parseInt(id)},
            data:{
                id: parseInt(id),
                name: body.name,
                category: body.category,        
                range: body.rangeKm, 
                fastCharginTime: body.fastChargingMinutes, 
                subsidyEligible: body.subsidyEligible, 
                active: body.active,
                manufacturer_id: body.manufacturer_id
            }
        })

        return NextResponse.json("Model Updated", {status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}


export async function DELETE(req: NextRequest, {params}:{params:Promise<{id: string}>}){
    const {id} = await params;
    try {
        const isAdmin = checkAdmin(req);
        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const model = await prisma.model.delete({where:{id: parseInt(id)}})

        if(model.active){
            return NextResponse.json("Cannot Delete active model", {status:400})
        }

        return NextResponse.json("Deleted", {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}