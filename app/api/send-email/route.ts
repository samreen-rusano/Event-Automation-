export const dynamic = 'force-dynamic';

import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { NextResponse } from "next/server";
import { EVENT_DATE } from "@/lib/config";
import { getPendingEmail } from "@/lib/emailTemplate";

export async function GET() {
    // Disabled: We only send the welcome email immediately upon registration now.
    return NextResponse.json({ success: true, message: "Scheduled emails are disabled." });
}