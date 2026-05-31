import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    try {
        const user = await User.findOneAndUpdate(
            { email: body.email },
            {
                $set: {
                    name: body.name,
                    phone: body.phone,
                    isPaid: true,
                },
                $setOnInsert: {
                    registeredAt: new Date(),
                    sentEmails: [],
                }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to register user" }, { status: 500 });
    }
}