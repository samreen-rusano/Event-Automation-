import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { EVENT_DATE } from "@/lib/config";
import { getPendingEmail } from "@/lib/emailTemplate";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.email || !body.phone || !body.website) {
        return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(body.phone)) {
        return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    try {
        const user = await User.findOneAndUpdate(
            { email: body.email },
            {
                $set: {
                    name: body.name,
                    phone: body.phone,
                    website: body.website,
                    isPaid: true,
                },
                $setOnInsert: {
                    registeredAt: new Date(),
                    sentEmails: [],
                }
            },
            { upsert: true, new: true }
        );

        // Trigger immediate email sending logic to ensure the user gets their first email right away
        try {
            const today = new Date();
            const diffTime = EVENT_DATE.getTime() - today.getTime();
            const hoursLeft = diffTime / (1000 * 60 * 60);

            const firstName = user.name ? user.name.split(" ")[0] : "there";
            const email = getPendingEmail(user.sentEmails || [], hoursLeft, firstName);

            if (email) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: email.subject,
                    html: email.html,
                });

                user.sentEmails.push(email.id);
                user.lastSentAt = new Date();
                await user.save();
            }
        } catch (emailError) {
            console.error("Failed to send initial email to", user.email, emailError);
            // We don't fail the registration if email fails
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to register user" }, { status: 500 });
    }
}