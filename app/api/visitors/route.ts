import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Simple counter collection
const CounterSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    count: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

// GET — returns current count
// POST — increments and returns new count
export async function GET() {
    await connectDB();
    const doc = await Counter.findOne({ key: "visitors" });
    return NextResponse.json({ count: doc?.count || 0 });
}

export async function POST() {
    await connectDB();
    const doc = await Counter.findOneAndUpdate(
        { key: "visitors" },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: "after" }
    );
    return NextResponse.json({ count: doc.count });
}
