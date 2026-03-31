export interface EmailData {
    id: string;
    subject: string;
    html: string;
}

export function renderHtml(firstName: string, lines: string[]): string {
    const primaryColor = "#F46F00"; // Pumpkin
    const primaryDark = "#E34200"; // Flame
    const bgDark = "#162228"; // Charleston Green
    const textDark = "#162228"; 
    const textMuted = "#45606D"; // Deep Space Sparkle
    const bgLight = "#F4F5F7"; 
    
    // Absolute URL is required for email clients to render images
    // Make sure NEXT_PUBLIC_APP_URL is set in your environment (e.g. https://your-domain.com)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK || "https://zoom.us/";
    const replayLink = process.env.NEXT_PUBLIC_REPLAY_LINK || `${baseUrl}/replay`;

    // Google Calendar "Add to Calendar" link
    // Event: April 10, 2026 06:00 AM – 07:30 AM DUBAI (90 min workshop)
    const calendarUrl = "https://www.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent("The Ultimate Sales Engine Framework — Live Workshop")
        + "&dates=20260410T020000Z/20260410T033000Z"
        + "&details=" + encodeURIComponent("Join the live workshop to learn how to transform your clothing brand into a predictable revenue machine.\n\nZoom Link: " + zoomLink)
        + "&location=" + encodeURIComponent("Zoom (Online)")
        + "&sf=true&output=xml";

    const formattedLines = lines.map(line => {
        if (!line.trim()) return "<br/>";

        // Replace placeholder links with real URLs
        line = line.replace(/\[Registration Link\]/g, zoomLink);
        line = line.replace(/\[Replay Link\]/g, replayLink);
        line = line.replace(/\[Calendar Link\]/g, calendarUrl);
        
        // Strip out any old inline button styles and rebrand it to our premium button
        if (line.includes("<a href=")) {
            return line.replace(
                /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
                `<div style="text-align: center; margin: 35px 0;">
                    <a href="$1" style="display: inline-block; padding: 16px 36px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; border-bottom: 3px solid ${primaryDark}; text-transform: uppercase; letter-spacing: 0.5px;">$2</a>
                </div>`
            );
        }

        // Standard text line
        return `<p style="font-size: 16px; font-weight: 400; color: ${textMuted}; margin: 0 0 16px 0; line-height: 1.6;">${line}</p>`;
    }).join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgLight}; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${bgLight}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(22, 34, 40, 0.08);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: ${bgDark}; padding: 35px 20px; border-bottom: 4px solid ${primaryColor};">
                            <img src="${baseUrl}/logoMain.png" alt="Zen Focus Media" width="160" style="display: block; max-width: 100%; height: auto;" onerror="this.style.display='none'">
                        </td>
                    </tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 45px 30px 45px;">
                            <h1 style="font-size: 24px; color: ${textDark}; margin-top: 0; margin-bottom: 24px; font-weight: 800; letter-spacing: -0.5px;">Hello ${firstName},</h1>
                            
                            ${formattedLines}
                            
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 45px; border-top: 2px solid #F0F2F5; padding-top: 35px;">
                                <tr>
                                    <td>
                                        <p style="font-size: 16px; color: ${textMuted}; margin: 0 0 6px 0;">Talk soon,</p>
                                        <p style="font-size: 18px; font-weight: 800; color: ${textDark}; margin: 0; letter-spacing: -0.3px;">Yasser Sultan</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: ${bgLight}; padding: 30px 24px; border-top: 1px solid #EAECEF;">
                            <p style="font-size: 13px; color: ${textMuted}; margin: 0; line-height: 1.6;">
                                © ${new Date().getFullYear()} Zen Focus Media. All rights reserved.<br>
                                No longer want to receive these emails? <a href="${baseUrl}/unsubscribe" style="color: ${primaryColor}; text-decoration: none; font-weight: 600;">Unsubscribe</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

// All templates defined with their trigger time (in hours relative to event)
// e.g. positive = before event, negative = after event
const templates = [
    // --- PRE-WEBINAR EMAILS ---
    {
        id: "pre_7d", triggerHours: 168, subject: "They lied to you about scaling clothing brands...",
        body: [
            "If you're still relying on ads, algorithms, and trends to scale your clothing brand...",
            "I'm sorry to say, but I've got some bad news for you:",
            "You're doing it the HARD way.",
            "Over the last several years, I've watched clothing brand owners generate sales… then lose them just as fast.",
            "ROAS goes up… then crashes.",
            "Sales come in… then disappear.",
            "Scaling works… until it suddenly doesn’t.",
            "But here’s the brutal truth:",
            "<b>You don’t have an ad problem. You have a demand control problem.</b>",
            "Because if you don’t control demand… your entire business is at the mercy of platforms, trends, and competition.",
            "What if I told you there was a way to turn your brand into a predictable sales engine… so you can scale without worrying about ROAS crashes or algorithm changes?",
            "I’m going to show you exactly how in the workshop you just registered for:" ,
            "<b>How to Build a Predictable, Scalable Sales Engine for Your Fashion Brand</b>",
            "Inside, I’ll show you:",
            "• Why most brands lose stability as they scale",
            "• How to generate demand instead of chasing it",
            "• The system behind consistent, predictable revenue",
            "• How we helped Abdul go from $80k at 2.5x ROAS → $1.1M at 3.3x ROAS",
            "Make sure you show up.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Access Your Workshop Details Here</a>"
        ]
    },
    {
        id: "pre_5d", triggerHours: 120, subject: "Quick question about your ad results",
        body: [
            "Quick question — do you ever feel like your ad results are completely unpredictable?",
            "Like one week everything’s working… and the next week, performance just drops for no clear reason?",
            "Even successful clothing brands I work with say the same thing…",
            "<em>'Yasir, we’re doing $25K+ months… but I never feel in control. One change and everything shifts.'</em>",
            "It’s not that your ads are bad. It’s that your revenue depends on things you don’t control. Algorithms change. Competition increases. Trends shift.",
            "So instead of trying to “fix” ads over and over again… what if you fixed the actual problem behind it all?",
            "<b>👉 Demand.</b>",
            "Because once you can generate demand consistently… everything becomes easier: your ads perform better, scaling becomes stable, and revenue becomes predictable.",
            "This is exactly what I’ll be breaking down inside the workshop you registered for.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Secure Your Spot Here</a>",
            "",
            "P.S. Still skeptical? Fair. That’s why I’ll be breaking down real case studies live—so you can see exactly how this works in practice."
        ]
    },
    {
        id: "pre_3d", triggerHours: 72, subject: "This should TERRIFY clothing brand owners (why it doesn’t scare me)",
        body: [
            "I came across something yesterday that should honestly concern most clothing brand owners.",
            "AI is now able to generate thousands of clothing designs in minutes…",
            "Brands can launch faster than ever. Competition is increasing overnight. Standing out is getting harder.",
            "Should this worry you? Maybe… But it doesn’t worry me.",
            "Here’s why:",
            "Because most brands are still playing the same game… chasing attention, relying on ads, hoping something works.",
            "While the few that actually scale do something completely different. <b>They control demand.</b>",
            "They build systems that consistently generate buyers—regardless of how crowded the market gets. And that’s something no amount of AI or competition can take away.",
            "I’ll be breaking down how to do this in the workshop you registered for.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Access Your Workshop Details Here</a>",
        ]
    },
    {
        id: "pre_2d", triggerHours: 48, subject: "How a 'generic' streetwear brand hit $100K/month (real story)",
        body: [
            "Listen. If you're tired of hearing about 'revolutionary marketing methods,' I get it.",
            "But hear me out for a sec.",
            "Last year, I had a client - let's call him Abdul - who was selling the EXACT same streetwear as hundreds of other brands. He was making $11,500 per month and spending $5,000 on ads with a measly 2.3x return.",
            "Abdul wasn't failing because his product was bad. He was failing because his MESSAGE was invisible.",
            "You see, most clothing brands are like background noise. They all say the same things: 'Premium quality,' 'Latest trends,' 'Fast shipping.'",
            "But customers don't buy clothes because of features. They buy clothes because of <b>IDENTITY</b>.",
            "We identified a specific group: Tech professionals who felt stuck in corporate environments… People who wanted to express themselves — without looking out of place.",
            "Then we built a message that made them feel: 'This brand gets me.'",
            "What happened next wasn’t luck. It was controlled demand. In 90 days: $12,500 → $75,000/month.",
            "What if your customers already felt drawn to what you sell… before even seeing the product?",
            "That’s exactly what I’m going to show you in our upcoming webinar.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Register Here</a>",
        ]
    },

    // --- REMINDER EMAILS ---
    {
        id: "rem_1d", triggerHours: 24, subject: "Are we still on for tomorrow?",
        body: [
            "Just a quick reminder that the AI-Powered Brand Scaling webinar is happening TOMORROW.",
            "During this live session, you’ll discover:",
            "✓ How we helped Abdul scale from $80K at 2.5x ROAS → $207K at 3.78x ROAS while nearly doubling ad spend",
            "✓ The exact AI-driven sales engine and identity-focused messaging framework",
            "✓ How to finally take control of your revenue so you can focus on creativity, lifestyle, and growth",
            "Plus, there’s a special bonus for live attendees only—something that could save you months of trial and error.",
            "Your spot is reserved. All you need to do is show up.",
            "<a href=\"[Calendar Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Add to Calendar Here</a>",
            "Tomorrow, everything changes. I can’t wait to share it with you."
        ]
    },
    {
        id: "rem_5h", triggerHours: 5, subject: "Your brand-scaling webinar starts in 5 hours!",
        body: [
            "This is your 5-hour reminder that the AI-Powered Brand Scaling webinar is happening TODAY.",
            "In just a few hours, you'll learn exactly how to break free from unpredictable revenue and create a system that consistently generates scalable sales.",
            "Here’s what I need you to do to get the most out of this:",
            "1. Clear your schedule—this is an investment in your freedom and your brand’s growth.",
            "2. Check your internet connection.",
            "3. Grab a notebook—you’re going to want to take notes.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Join the Webinar Room Here</a>",
        ]
    },
    {
        id: "rem_1h", triggerHours: 1, subject: "We go LIVE in 1 hour — are you ready?",
        body: [
            "This is your 1-hour reminder!",
            "In just 60 minutes, you'll discover the psychology that turns browsers into buyers and how to build a system that makes every dollar count.",
            "I know what it’s like to ride the roller coaster of unpredictable revenue. One month you’re up, the next month you’re guessing if you’ll hit your numbers. That ends today.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Join the Webinar Room Here</a>",
        ]
    },
    {
        id: "rem_live", triggerHours: 0, subject: "We are LIVE! [AI-Powered Brand Growth]",
        body: [
            "We are now LIVE for the AI-Powered Brand Growth webinar!",
            "The live seats are filling up fast, so click the link NOW to make sure you don’t miss out:",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 16px 32px; font-size: 18px; font-weight: bold; background-color: #34a853; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">JOIN HERE NOW</a>",
            "This is it – your chance to finally break free from unpredictable revenue. See you inside!"
        ]
    },

    // --- POST-WEBINAR EMAILS ---
    {
        id: "post_0h", triggerHours: -1, subject: "Here's your replay of 'The One Ad That Changes Everything'...",
        body: [
            "Did you miss the webinar? If so, it's really too bad, because clothing brand owners were MIND-BLOWN.",
            "I wanted to share the replay with you, because this information is way too valuable to skip.",
            "When you catch the replay, you'll find out EXACTLY how clothing brand owners are hitting consistent $10K+ monthly profit in just 90 days with ONE irresistible ad…",
            "But don't wait too long to watch the replay - I'm only leaving it up for 72 hours.",
            "After that… POOF. It's gone.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay</a>",
        ]
    },
    {
        id: "post_24h", triggerHours: -24, subject: "Here’s your replay of the AI-Powered Brand Growth webinar…",
        body: [
            "Did you miss the AI-Powered Brand Growth webinar? You’re not alone, but the good news is—you can still catch the replay.",
            "Inside, you’ll discover exactly how clothing brand owners are hitting predictable $100K+ monthly using AI, identity-driven messaging, and automated systems…",
            "Even if you’ve struggled with agencies, wasted ad spend, or inconsistent results.",
            "The replay is only available for a strictly limited time.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay</a>",
        ]
    },
    {
        id: "post_48h", triggerHours: -48, subject: "This freedom bonus is about to expire…",
        body: [
            "One of the special bonuses I revealed during the webinar is expiring in less than 24 hours:",
            "✓ Complete Email Marketing Campaign Setup ($3,000 value)",
            "✓ Advanced Video Editing & Graphics Package ($2,500 value)",
            "✓ Priority Support & Weekly Strategy Intensives ($1,500 value)",
            "Want the full details? Watch the replay.",
            "Inside, you’ll discover the exact AI-driven process that generated $10M+ for clients.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay & Claim Bonuses</a>",
        ]
    },
    {
        id: "post_final", triggerHours: -72, subject: "Have you seen this? (Final Replay Reminder)",
        body: [
            "Clothing brand owners are going BANANAS over the AI-Powered Brand Growth replay.",
            "Inside, you’ll see how simple it is to break free from unpredictable revenue, even if you think your brand is 'different.'",
            "But the replay goes down TONIGHT at midnight.",
            "You’ll learn how AI + Identity-driven messaging creates predictable profits. Don’t miss your chance to finally take control of your business.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch Before It Expires</a>",
        ]
    }
];

export function getPendingEmail(sentEmailIds: string[], hoursUntilEvent: number, firstName: string): EmailData | null {
    // Sort templates: we want to trigger the ones that are closest to current time, but their trigger time has already passed.
    // That means triggerHours >= hoursUntilEvent (for pre-event emails, say it's 70 hours until event. triggerHours 72 means the 72h email is eligible).
    // Wait, the logic:
    // Event is AT `eventTime`. Current time is `currentTime`.
    // hoursUntilEvent = (eventTime - currentTime)
    // If we are 120 hours before event, `pre_5d` (trigger: 120) becomes eligible.
    // If we are 119 hours before event, `pre_5d` is still eligible until the next one.
    // So if triggerHours >= hoursUntilEvent, it's eligible.
    // We want the **most recent** eligible one (smallest triggerHours that is >= hoursUntilEvent is wrong, because smallest triggerHours could be 0, which is later).
    // Wait! As time passes, hoursUntilEvent decreases. 
    // Example: 
    // hoursUntilEvent = 120 -> pre_5d (120) is eligible.
    // hoursUntilEvent = 119 -> pre_5d (120), pre_7d (168) are both mathematically triggerHours >= hoursUntilEvent.
    // The most recent one is the one with the SMALLER triggerHours among the eligible ones.

    // Let's filter all eligible templates:
    const eligibleTemplates = templates.filter(t => t.triggerHours >= hoursUntilEvent);

    // Pick the one with the smallest triggerHours (the closest to the current time, so the newest)
    eligibleTemplates.sort((a, b) => a.triggerHours - b.triggerHours);

    for (const template of eligibleTemplates) {
        if (!sentEmailIds.includes(template.id)) {
            return {
                id: template.id,
                subject: template.subject,
                html: renderHtml(firstName, template.body)
            };
        }
    }

    return null;
}