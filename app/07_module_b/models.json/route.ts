import { checkAdmin } from "@/lib/checkAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const models = await prisma.model.findMany({
            where:{
                active: true
            },
            include:{
                manufacturer:{
                    select: {
                        name: true
                    }
                }
            }
        })
        return NextResponse.json(models)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}