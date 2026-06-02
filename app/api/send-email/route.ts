export const dynamic = 'force-dynamic';

import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { NextResponse } from "next/server";
import { EVENT_DATE } from "@/lib/config";
import { getPendingEmail } from "@/lib/emailTemplate";

export async function GET() {
    await connectDB();

    const users = await User.find();
    const today = new Date();

    for (const user of users) {
        const diffTime = EVENT_DATE.getTime() - today.getTime();
        const hoursLeft = diffTime / (1000 * 60 * 60);

        const firstName = user.name ? user.name.split(" ")[0] : "there";
        const email = getPendingEmail(user.sentEmails || [], hoursLeft, firstName);

        if (!email) continue;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: email.subject,
                html: email.html,
            });

            user.sentEmails.push(email.id);
            user.lastSentAt = new Date();
            await user.save();
        } catch (error) {
            console.error("Failed to send email to", user.email, error);
        }
    }

    return NextResponse.json({ success: true, message: "Emails processed" });
}