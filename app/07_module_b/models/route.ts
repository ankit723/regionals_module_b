import { checkAdmin } from "@/lib/checkAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const isAdmin = checkAdmin(req);
        if(!isAdmin){
            return NextResponse.json({message: "Unauthorized"}, {status: 401})
        }
        const models = await prisma.model.findMany({
            include:{
                manufacturer:{
                    select: {
                        name: true
                    }
                }
            }
        })
        return NextResponse.json({...models})
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
        let {id, name, manufacturerId, category, rangeKm, fastChargingMinutes, subsidyEligible, active} = await req.json();
        
        if(!id || !name || active===null || !manufacturerId || !category || !rangeKm || !fastChargingMinutes || !subsidyEligible || rangeKm < 0){
            return NextResponse.json({message: "Validation Error"}, {status: 400})
        }
        
        const manufacturer = await prisma.manufacturer.findUnique({where: {id: parseInt(manufacturerId)}})
        
        if(!manufacturer){
            return NextResponse.json({message: "Validation Error"}, {status: 400})
        }

        let sub = category.split("-")
        category = sub.reduce((a:any, s:any)=>a+s)

        const model = await prisma.model.create({
            data:{
                id,
                name,
                category, 
                range: rangeKm, 
                fastCharginTime:fastChargingMinutes, 
                subsidyEligible, 
                active,
                manufacturer_id: parseInt(manufacturerId)
            }
        })
        
        return NextResponse.json("Model Created", {status:201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There is some error from our end. Please Try Again"}, {status: 500})
    }
}


