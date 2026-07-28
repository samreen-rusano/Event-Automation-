import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { transporter } from "@/lib/mailer";
import { getEmailForPurchase } from "@/lib/emailTemplate";

// This endpoint can be triggered by Vercel Cron or a manual background task.
// e.g. using vercel.json cron: { "path": "/api/cron/fallback-emails", "schedule": "*/15 * * * *" }
export async function GET(req: Request) {
  try {
    // Check authorization (e.g. Vercel cron secret) if needed
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    // Find users who paid, haven't received any emails, 
    // and registered more than 15 minutes ago.
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const droppedOffUsers = await User.find({
      isPaid: true,
      sentEmails: { $size: 0 },
      registeredAt: { $lt: fifteenMinutesAgo }
    });

    let sentCount = 0;

    for (const userDoc of droppedOffUsers) {
      const allPurchasedItems = userDoc.purchasedItems || [];
      const emailData = getEmailForPurchase(allPurchasedItems, userDoc.name ? userDoc.name.split(" ")[0] : "there");

      if (emailData) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userDoc.email,
            subject: emailData.subject,
            html: emailData.html,
          });
          
          userDoc.sentEmails.push(emailData.id);
          userDoc.lastSentAt = new Date();
          await userDoc.save();
          sentCount++;
        } catch (err) {
          console.error(`Failed to send fallback email to ${userDoc.email}`, err);
        }
      }
    }

    return NextResponse.json({ success: true, processed: droppedOffUsers.length, sent: sentCount });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("[CRON] fallback-emails error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
