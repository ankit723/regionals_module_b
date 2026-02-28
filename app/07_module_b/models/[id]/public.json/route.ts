import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, {params}:{params:Promise<{id: string}>}){
    const {id} = await params;
    try {
        const model = await prisma.model.findUnique({where:{id: parseInt(id), active: true}})
        if(!model){
            return NextResponse.json({status: 404})
        }
        return NextResponse.json(model)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}