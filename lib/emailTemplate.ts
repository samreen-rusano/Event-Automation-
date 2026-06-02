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
    const meetLink = process.env.NEXT_PUBLIC_MEET_LINK || "https://meet.google.com/jqn-iuob-pbz";
    const replayLink = process.env.NEXT_PUBLIC_REPLAY_LINK || `${baseUrl}/replay`;

    // Google Calendar "Add to Calendar" link
    // Event: Tuesday, May 26, 2026 03:00 PM – 04:30 PM New York time (EST) (90 min workshop)
    const calendarUrl = "https://www.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent("How Clothing Brands Scale Without Destroying Profitability — Live Workshop")
        + "&dates=20260526T190000Z/20260526T203000Z"
        + "&details=" + encodeURIComponent("Join the live workshop to learn the system behind predictable growth and stable ROAS for your clothing brand.\n\nGoogle Meet Link: " + meetLink + "\nPhone Dial: +1 289-949-4718 PIN: 619 166 014#")
        + "&location=" + encodeURIComponent("Google Meet (Online)")
        + "&sf=true&output=xml";

    const formattedLines = lines.map(line => {
        if (!line.trim()) return "<br/>";

        // Replace placeholder links with real URLs
        line = line.replace(/\[Registration Link\]/g, meetLink);
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
                            <img 
                                src="${baseUrl}/logoMain.png" 
                                alt="Zen Focus Media" 
                                width="180" 
                                style="display: block; border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;"
                            >
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
                                        <p style="font-size: 18px; font-weight: 800; color: ${textDark}; margin: 0; letter-spacing: -0.3px;">Yasir Sultan</p>
                                        <p style="font-size: 14px; font-weight: 500; color: ${textMuted}; margin: 0;">Founder, Zen Focus Media</p>
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
    // --- IMMEDIATE WELCOME EMAIL ---
    {
        id: "immediate_welcome", triggerHours: 999999, subject: "You're In! Your Workshop Registration Is Confirmed",
        body: [
            "You're officially registered.",
            "On June 14th, I'll be breaking down how we helped a clothing brand add $1.2 million in revenue in 13 months—and more importantly, the exact process we used to identify the bottlenecks that were preventing growth in the first place.",
            "Workshop Details:",
            "<b>Date:</b> June 14, 2026",
            "<b>Time:</b> 3PM EST",
            "<a href=\"[Registration Link]\">Click here to Join the Google Meet</a>",
            "",
            "Before we meet, I'd like you to think about one question:",
            "What's the biggest thing currently preventing your brand from growing?",
            "Most brand owners immediately answer:",
            "\"More traffic.\"",
            "\"Better ads.\"",
            "\"More content.\"",
            "\"More followers.\"",
            "But after auditing hundreds of clothing brands, I've noticed something interesting:",
            "Most brands don't struggle because they're missing tactics.",
            "They struggle because they're solving the wrong problem.",
            "The brands that scale consistently aren't necessarily working harder.",
            "They're simply focusing on the right bottleneck at the right time.",
            "During this workshop, I'll walk you through the same root cause analysis framework we used to identify the constraint limiting growth for a clothing brand that eventually went on to add $1.2 million in revenue.",
            "My goal isn't to give you another list of marketing tactics.",
            "My goal is to help you gain clarity on what actually deserves your attention next.",
            "In the meantime, add the workshop to your calendar and set a reminder now.",
            "<a href=\"[Calendar Link]\">Add to Google Calendar</a>",
            "I look forward to seeing you there."
        ]
    },
    
    // --- PRE-WEBINAR EMAILS ---
    {
        id: "pre_7d", triggerHours: 168, subject: "They lied to you about scaling clothing brands...",
        body: [
            "If you've been working hard to grow your clothing brand but still feel stuck...",
            "There's a good chance you're solving the wrong problem.",
            "I know that's not what most marketers will tell you.",
            "Most will tell you:",
            "• You need better ads.",
            "• More content.",
            "• More traffic.",
            "• More influencers.",
            "• A new funnel.",
            "• A better website.",
            "• A different offer.",
            "But after consulting hundreds of clothing brands, I've noticed something interesting.",
            "Many founders aren't struggling because they lack tactics.",
            "They're struggling because they haven't accurately identified the bottleneck limiting growth.",
            "Think about it.",
            "If your problem is customer acquisition, then improving retention won't help much.",
            "If your problem is positioning, then spending more on ads won't solve it.",
            "If your problem is strategic direction, then producing more content won't suddenly create growth.",
            "<b>The right solution depends on the actual constraint.</b>",
            "That's exactly why I'm hosting a free workshop:",
            "<b>How We Helped a Clothing Brand Add $1.2 Million in Revenue in 13 Months</b>",
            "During this workshop, I'll break down:",
            "✓ Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "✓ How to identify the biggest constraint limiting growth in your business",
            "✓ How to define a clear vision, purpose, and growth targets",
            "✓ How to build a customer acquisition system around those goals",
            "✓ The exact framework that helped a clothing brand grow from roughly $35k/month to consistent $100k+ months",
            "If you're tired of guessing what's actually holding your brand back, this workshop is for you.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">REGISTER FOR FREE</a>",
            "",
            "P.S. Most founders don't need more information.",
            "They need greater clarity about what deserves their attention next."
        ]
    },
    {
        id: "pre_5d", triggerHours: 120, subject: "Quick question about your growth strategy",
        body: [
            "Quick question — do you ever feel like you're throwing money into a black hole when it comes to Facebook ads?",
            "Like you're constantly testing new audiences, new creatives, new copy... but nothing seems to stick?",
            "If so, I get it.",
            "Even successful clothing brands I work with tell me the same thing...",
            "<em>\"Yasir, I'm spending $10K a month on ads, but I never know which ones will work. It's like gambling with my business.\"</em>",
            "My solution?",
            "<b>Stop testing everything and START with psychology.</b>",
            "If you're not a mind reader, don't have years of advertising experience, or haven't spent $100K+ learning what works...",
            "I've got something MUCH better to show you.",
            "It's called the \"One Irresistible Ad Formula\" — and it's specifically designed for clothing brand owners who want predictable profits, not expensive experiments.",
            "So if you're interested in hitting consistent $10K+ monthly profit without burning through your budget, you won't want to miss my upcoming FREE webinar:",
            "\"The One Ad That Changes Everything: How Clothing Brand Owners Are Hitting Consistent $10K+ Monthly Profit in 90 Days\"",
            "In this live training, you'll discover:",
            "• Why your competitors are failing (and how to capitalize on their mistakes)",
            "• The exact psychology that turns browsers into buyers for clothing brands",
            "• My \"Zero-Risk Roadmap System\" — know it'll work BEFORE you spend a dollar",
            "And... I'll also reveal a special case study of how one streetwear brand went from competing with everyone to having customers specifically seek them out.",
            "Even if you've tried everything before and failed.",
            "Trust me, you don't want to miss this.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Click here to secure your spot</a>",
            "",
            "P.S. Still skeptical? I get it. But I'm so confident in the power of this system, I'll be sharing LIVE case studies during the webinar.",
            "Real brands. Real results. Real profits.",
            "That's right — this will ONLY be available to people who make it live."
        ]
    },
    {
        id: "pre_3d", triggerHours: 72, subject: "The uncomfortable truth about clothing brands",
        body: [
            "Over the last few years, I've noticed something interesting.",
            "Most clothing brands don't fail because they lack effort.",
            "They fail because they're busy solving problems that aren't actually limiting growth.",
            "Think about it.",
            "A founder spends months redesigning their website.",
            "Another spends months creating content.",
            "Another spends months testing ads.",
            "Another spends months searching for the perfect product.",
            "Everyone is working.",
            "Everyone is trying.",
            "Yet many brands remain stuck at the same level year after year.",
            "Why?",
            "<b>Because growth doesn't come from fixing random problems.</b>",
            "<b>Growth comes from identifying and solving the right problem.</b>",
            "That's the uncomfortable truth.",
            "Most founders don't know what's actually holding their business back.",
            "And because they don't know, they end up spreading their attention across dozens of different initiatives.",
            "The result? Lots of activity. Very little progress.",
            "That's exactly why I'm hosting this workshop:",
            "<b>How We Helped a Clothing Brand Add $1.2 Million in Revenue in 13 Months</b>",
            "Inside, I'll walk you through:",
            "✓ Why most clothing brands stay stuck for years",
            "✓ How to identify the biggest constraint limiting growth",
            "✓ How to define a clear vision, purpose, and growth targets",
            "✓ How to build a customer acquisition system around those goals",
            "✓ The exact framework behind a brand's growth from roughly $35k/month to consistent $100k+ months",
            "The goal isn't to give you more tactics.",
            "The goal is to help you identify what actually deserves your attention next.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">REGISTER FOR FREE</a>",
            "",
            "P.S. Most founders already know enough marketing to grow.",
            "The challenge is knowing which problem deserves to be solved first."
        ]
    },
    {
        id: "pre_2d", triggerHours: 48, subject: "How a 'generic' streetwear brand hit $100K/month (real story)",
        body: [
            "I want to share a story with you.",
            "A while ago, I worked with a clothing brand owner named Abdul.",
            "At the time, he was generating roughly $25,000 per month in revenue while spending around $10,000 per month on advertising.",
            "The business wasn't failing.",
            "But it wasn't growing the way he wanted either.",
            "Every attempt to scale seemed to create new problems.",
            "More spending. More complexity. More uncertainty.",
            "Sound familiar?",
            "What's interesting is that the solution wasn't simply spending more money.",
            "And it wasn't testing new creatives or trying a new platform.",
            "The first step was understanding what was actually limiting growth.",
            "Because until you identify the constraint, every solution feels like guesswork.",
            "After taking a step back and analyzing the business, we were able to identify opportunities that had previously gone unnoticed.",
            "That clarity changed everything.",
            "It influenced how the business approached customer acquisition.",
            "How it communicated with customers.",
            "How it allocated resources.",
            "And how decisions were made moving forward.",
            "The result?",
            "Revenue grew from roughly $25k per month to approximately $100k per month.",
            "Over time, the business added more than $1.2 Million USD in revenue.",
            "Not because we worked harder. But because we focused on the right problem.",
            "That's exactly what we'll be discussing during the workshop:",
            "<b>How We Helped a Clothing Brand Add $1.2 Million in Revenue in 13 Months</b>",
            "Inside, I'll walk you through:",
            "✓ Why most clothing brands stay stuck for years",
            "✓ How to identify the biggest constraint limiting growth",
            "✓ How to define a clear vision and growth targets",
            "✓ How to build a customer acquisition system around those goals",
            "✓ The framework we use to turn clarity into consistent growth",
            "If you're tired of guessing what deserves your attention next, I think you'll find this valuable.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">REGISTER FOR FREE</a>",
            "",
            "P.S. Most founders assume growth comes from finding the right tactic.",
            "In my experience, growth usually comes from identifying the right bottleneck first."
        ]
    },

    // --- REMINDER EMAILS ---
    {
        id: "rem_1d", triggerHours: 24, subject: "Are we still on for tomorrow?",
        body: [
            "Just a quick reminder that our workshop is happening tomorrow.",
            "Here's the join link:",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Join Workshop Here</a>",
            "Tomorrow, I'll be walking you through the exact process we used to help a clothing brand add $1.2 million in revenue in 13 months.",
            "More importantly, I'll show you how we identified the bottleneck that was preventing growth before we ever discussed ads, content, or customer acquisition.",
            "Here's what you'll learn:",
            "✓ Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "✓ How to identify the single biggest constraint limiting growth in your business",
            "✓ How to define a clear vision, purpose, and growth targets that make decision-making dramatically easier",
            "✓ How to design a customer acquisition system that supports your goals instead of creating more complexity",
            "✓ How to execute, measure, and improve performance without relying on guesswork or chasing trends",
            "One thing I've learned after consulting hundreds of clothing brands:",
            "Most owners aren't lacking effort.",
            "Most owners aren't lacking information.",
            "They're simply focusing on the wrong problem.",
            "And when you're solving the wrong problem, even great execution produces disappointing results.",
            "Tomorrow's workshop is designed to help you uncover what actually deserves your attention next.",
            "Your spot is already reserved.",
            "Just show up with an open mind and something to take notes with."
        ]
    },
    {
        id: "rem_5h", triggerHours: 5, subject: "Workshop starts in 5 hours!",
        body: [
            "Just a quick reminder that our workshop begins in 5 hours.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Join Workshop Here</a>",
            "Before we go live, I'd like you to think about something.",
            "If your clothing brand doubled in size over the next 12 months, what would have needed to change?",
            "Most owners immediately think: \"Better ads.\" \"More traffic.\" \"More content.\"",
            "But after consulting hundreds of clothing brands, I've found that growth usually isn't limited by effort.",
            "It's limited by a constraint.",
            "One bottleneck. One decision. One problem that, when solved, makes everything else easier.",
            "Today's workshop is designed to help you identify that constraint.",
            "We'll walk through the exact root cause analysis, growth strategy, and customer acquisition framework behind a clothing brand's journey from $35k/month to consistent $100k+ months.",
            "You'll leave with:",
            "✓ A clearer understanding of what's actually limiting growth",
            "✓ A framework for defining your next growth target",
            "✓ A system for aligning your marketing with your business objectives",
            "✓ A practical approach for measuring and improving performance over time",
            "Bring a notebook. Bring an open mind.",
            "And come prepared to challenge some assumptions about what's really holding your brand back.",
            "Your seat is reserved. I'll see you in a few hours.",
            "",
            "P.S. Most founders leave workshops looking for new tactics. My goal is to help you leave with something more valuable: clarity on what deserves your attention next."
        ]
    },
    {
        id: "rem_1h", triggerHours: 1, subject: "We start in ONE hour!",
        body: [
            "We go live in one hour.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Join Workshop Here</a>",
            "In the next 60 minutes, you'll get an inside look at how we helped a clothing brand add $1.2 million in revenue in 13 months.",
            "More importantly, you'll learn the process we used to identify the bottlenecks that were preventing growth long before we discussed ads, content, or customer acquisition.",
            "Here's what we'll cover:",
            "✓ Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "✓ How to identify the biggest constraint limiting growth in your business",
            "✓ How to define a clear vision, purpose, and growth targets",
            "✓ How to build a customer acquisition system that supports your goals",
            "✓ How to execute, measure, and improve performance without relying on guesswork",
            "Before joining, take 30 seconds to answer this question:",
            "\"What do I believe is currently preventing my brand from growing?\"",
            "Write down your answer.",
            "Then compare it to the framework we'll cover during the workshop.",
            "You may discover that the real bottleneck is completely different from what you originally thought.",
            "Your seat is reserved. All that's left is to show up.",
            "",
            "P.S. The founders who get the most value from this workshop aren't necessarily the smartest or most experienced. They're the ones willing to challenge their assumptions and look at their business objectively."
        ]
    },
    {
        id: "rem_live", triggerHours: 0, subject: "We're Live — Join Us Now",
        body: [
            "We're live right now.",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 16px 32px; font-size: 18px; font-weight: bold; background-color: #34a853; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">JOIN HERE NOW</a>",
            "Today we're breaking down:",
            "• How we helped a clothing brand add $1.2 million in revenue in 13 months",
            "• The root cause analysis process we used to identify the bottlenecks limiting growth",
            "• The growth strategy and customer acquisition system behind their journey from $35k/month to consistent $100k+ months",
            "• The framework you can use to identify what's actually preventing your own clothing brand from growing",
            "If you've ever felt like you're working hard but still unsure what's truly holding your business back, this workshop is for you.",
            "Click below and join us now:",
            "<a href=\"[Registration Link]\" style=\"display: inline-block; padding: 16px 32px; font-size: 18px; font-weight: bold; background-color: #34a853; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">JOIN HERE NOW</a>",
            "",
            "P.S. Most founders leave with at least one realization that changes how they think about growth. Don't miss it."
        ]
    },

    // --- POST-WEBINAR EMAILS ---
    {
        id: "post_0h", triggerHours: -1, subject: "Here's your workshop replay (available for 72 hours)",
        body: [
            "If you missed the workshop, don't worry.",
            "I've made the replay available for the next 72 hours.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay Here</a>",
            "During the workshop, we broke down how a clothing brand grew from roughly $35k/month to consistent $100k+ months and added $1.2 million in revenue over 13 months.",
            "But the most important lesson wasn't the revenue. It was the process.",
            "Specifically: How we identified the bottleneck that was limiting growth before spending more money on ads, content, or influencers.",
            "Inside the replay, you'll learn:",
            "✓ Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "✓ How to identify the biggest constraint limiting growth in your business",
            "✓ How to define a clear vision, purpose, and growth targets",
            "✓ How to build a customer acquisition system around your objectives",
            "✓ How to execute, measure, and improve performance over time",
            "One of the biggest mistakes I see founders make is assuming they know what's holding them back.",
            "Often, the real bottleneck is somewhere else entirely.",
            "And until that bottleneck is identified, every new tactic feels like another shot in the dark.",
            "That's exactly why I recommend watching the replay before it comes down.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay Here</a>",
            "The replay will only be available for the next 72 hours. After that, it will be removed.",
            "",
            "P.S. As you're watching, ask yourself one question: \"What do I believe is currently preventing my brand from growing?\"",
            "Then compare your answer to the framework we cover in the workshop. That exercise alone could be worth the entire training."
        ]
    },
    {
        id: "post_24h", triggerHours: -24, subject: "I'm taking this down soon (and most founders miss this point)",
        body: [
            "The workshop replay is still available, but not for much longer.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch it here</a>",
            "As I've been reflecting on the workshop, there's one idea that keeps coming back to me.",
            "Most clothing brands don't fail because they lack effort.",
            "They fail because they misdiagnose the problem.",
            "Think about it.",
            "If a founder believes their problem is traffic, they'll buy more ads.",
            "If they believe their problem is content, they'll post more content.",
            "If they believe their problem is conversion, they'll redesign their website.",
            "But what happens if none of those are actually the bottleneck?",
            "Now they're working harder… spending more money… testing more tactics…",
            "Yet seeing little progress.",
            "That's why the first thing we focus on isn't ads. It isn't content. It isn't influencers.",
            "<b>It's diagnosis.</b>",
            "Because the right solution depends on the actual constraint.",
            "Inside the workshop replay, I walk through the same process we used to identify the bottleneck limiting growth for a clothing brand that eventually went on to add $1.2 million in revenue over 13 months.",
            "You'll also see:",
            "✓ Why most clothing brands stay stuck for years",
            "✓ How to identify the biggest growth constraint in your business",
            "✓ How to define a clear vision and growth targets",
            "✓ How to build a customer acquisition system that supports those goals",
            "✓ How to measure and improve performance without guessing",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay Here</a>",
            "The replay will be removed soon. And once it's gone, it won't be available again.",
            "",
            "P.S. Here's a question worth thinking about: If your brand doubled over the next 12 months, what would have needed to change?",
            "Your answer to that question might reveal more than you think."
        ]
    },
    {
        id: "post_48h", triggerHours: -48, subject: "Most founders never identify this bottleneck",
        body: [
            "The workshop replay comes down in less than 24 hours.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch it here</a>",
            "Over the years, I've noticed something interesting.",
            "Most clothing brand owners don't struggle because they're lazy.",
            "They don't struggle because they're unintelligent.",
            "And they don't struggle because they haven't tried hard enough.",
            "They struggle because they're focused on solving the wrong problem.",
            "I've seen founders spend months improving ads when the bottleneck was actually their offer.",
            "I've seen founders obsess over content when the real issue was customer acquisition.",
            "I've seen founders redesign websites when the bigger challenge was a lack of strategic direction.",
            "The difficult part is that when you're inside the business every day, it's hard to see these things objectively.",
            "That's why we built the workshop around one central idea:",
            "<b>Correct diagnosis comes before effective action.</b>",
            "Inside the replay, you'll see the exact framework we used to identify the bottleneck limiting growth for a clothing brand that eventually added $1.2 million in revenue over 13 months.",
            "You'll also learn:",
            "✓ Why most clothing brands stay stuck for years",
            "✓ How to define a clear vision and growth targets",
            "✓ How to build a customer acquisition system around your goals",
            "✓ How to execute, measure, and improve performance over time",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch the Replay Here</a>",
            "The replay will be removed in less than 24 hours.",
            "",
            "P.S. One of the most expensive mistakes a founder can make is spending the next six months solving a problem that isn't actually limiting growth.",
            "That's the real cost of poor diagnosis."
        ]
    },
    {
        id: "post_final", triggerHours: -72, subject: "Have you seen this?",
        body: [
            "Have you seen this yet?",
            "[Screenshot: \"This completely changed how I think about growth.\"]",
            "[Screenshot: \"I realized I've been focusing on the wrong problem for months.\"]",
            "[Screenshot: \"The bottleneck framework alone was worth attending.\"]",
            "The replay for our workshop is coming down tonight.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch it here before it's removed</a>",
            "One of the most common reactions we've received is surprisingly simple:",
            "\"I finally understand what I've been missing.\"",
            "Not because we shared some secret ad hack.",
            "Not because we revealed a magic funnel.",
            "But because many founders realize they've been investing time, money, and energy into solving the wrong problem.",
            "Inside the workshop, we break down:",
            "✓ How we helped a clothing brand add $1.2 million in revenue over 13 months",
            "✓ The root cause analysis process we used to identify the bottleneck limiting growth",
            "✓ Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "✓ How to define a clear vision, purpose, and growth targets",
            "✓ How to build a customer acquisition system that supports those goals",
            "✓ How to execute, measure, and improve performance without relying on guesswork",
            "The replay disappears tonight. After that, it won't be available.",
            "<a href=\"[Replay Link]\" style=\"display: inline-block; padding: 12px 24px; background-color: #d93025; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 15px;\">Watch it here before it's gone</a>",
            "",
            "P.S. Most founders are only one insight away from making dramatically better decisions.",
            "The challenge is that many never discover what that insight is.",
            "Don't let the replay disappear before you've had a chance to watch it."
        ]
    }
];

export function getPendingEmail(sentEmailIds: string[], hoursUntilEvent: number, firstName: string): EmailData | null {
    // 1. Always prioritize the immediate welcome email if it hasn't been sent yet.
    const immediateTemplate = templates.find(t => t.id === "immediate_welcome");
    if (immediateTemplate && !sentEmailIds.includes(immediateTemplate.id)) {
        return {
            id: immediateTemplate.id,
            subject: immediateTemplate.subject,
            html: renderHtml(firstName, immediateTemplate.body)
        };
    }

    // Sort remaining timeline templates: we want to trigger the ones that are closest to current time, but their trigger time has already passed.
    // That means triggerHours >= hoursUntilEvent (for pre-event emails, say it's 70 hours until event. triggerHours 72 means the 72h email is eligible).

    // Let's filter all eligible templates (excluding immediate_welcome):
    const eligibleTemplates = templates.filter(t => t.triggerHours >= hoursUntilEvent && t.id !== "immediate_welcome");

    // Pick the one with the smallest triggerHours (the closest to the current time, so the newest)
    eligibleTemplates.sort((a, b) => a.triggerHours - b.triggerHours);

    // Only send the SINGLE most recent eligible email. If they just registered, we don't want to send them 
    // older backlog emails (e.g., sending a "7 days left" email when there are only 3 days left).
    if (eligibleTemplates.length > 0) {
        const mostRecentTemplate = eligibleTemplates[0];
        if (!sentEmailIds.includes(mostRecentTemplate.id)) {
            return {
                id: mostRecentTemplate.id,
                subject: mostRecentTemplate.subject,
                html: renderHtml(firstName, mostRecentTemplate.body)
            };
        }
    }

    return null;
}