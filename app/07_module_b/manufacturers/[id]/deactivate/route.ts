import { checkAdmin } from "@/lib/checkAdmin"
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req:NextRequest, {params}:{params:Promise<{id: string}>}) {
    try {
        const {id} = await params;
        const isAdmin = checkAdmin(req)

        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }

        await prisma.$transaction([

            prisma.manufacturer.update({
                where:{id:parseInt(id)},
                data:{active:false}
            }),

            prisma.model.updateMany({
                where:{manufacturer_id: parseInt(id)},
                data:{active: false}
            })
        ])

        return NextResponse.json("Manufacturer Deactivated", {status: 200})


        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}