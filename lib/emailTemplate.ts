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
    const meetLink = process.env.NEXT_PUBLIC_MEET_LINK || "https://meet.google.com/wfh-imfb-dno";
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
        line = line.replace(/\[LINK\]/gi, meetLink);
        line = line.replace(/\[Link\]/gi, meetLink);
        line = line.replace(/\[link\]/gi, meetLink);
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
                    <!-- No Header -->
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 40px 45px 30px 45px;">
                            <h1 style="font-size: 24px; color: ${textDark}; margin-top: 0; margin-bottom: 24px; font-weight: 800; letter-spacing: -0.5px;">Hello ${firstName},</h1>
                            
                            ${formattedLines}
                            
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 45px; border-top: 2px solid #F0F2F5; padding-top: 35px;">
                                <tr>
                                    <td>
                                        <p style="font-size: 16px; color: ${textMuted}; margin: 0 0 6px 0;">Talk soon,</p>
                                        <p style="font-size: 18px; font-weight: 800; color: ${textDark}; margin: 0; letter-spacing: -0.3px;">Yasir</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: ${bgLight}; padding: 30px 24px; border-top: 1px solid #EAECEF;">
                            <p style="font-size: 13px; color: ${textMuted}; margin: 0; line-height: 1.6;">
                                © ${new Date().getFullYear()} All rights reserved.<br>
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
    {
        id: "immediate_welcome", triggerHours: Infinity, subject: "You're registered! Here's what's next...",
        body: [
            "Thanks for reserving your spot for the FREE 4-Week Sell Out Your Drop Challenge.",
            "Over the next few days, I'll show you exactly how the challenge works, what's included, the unique formula we're using, and how to know whether the FREE 4 Week challenge is the right fit for your brand.",
            "If it looks like a good fit, I'll explain how to join the challenge."
        ]
    },
    {
        id: "pre_promo_1", triggerHours: 168, subject: "They lied to you about scaling clothing brands...",
        body: [
            "If you've been working hard to grow your clothing brand but still feel stuck...",
            "There's a good chance you're solving the wrong problem.",
            "I know that's not what most marketers will tell you.",
            "Most will tell you:",
            "You need better ads.",
            "More content.",
            "More traffic.",
            "More influencers.",
            "A new funnel.",
            "A better website.",
            "A different offer.",
            "But after consulting hundreds of clothing brands, I've noticed something interesting.",
            "Many founders aren't struggling because they lack tactics.",
            "They're struggling because they haven't accurately identified the bottleneck limiting growth.",
            "Think about it.",
            "If your problem is customer acquisition, then improving retention won't help much.",
            "If your problem is positioning, then spending more on ads won't solve it.",
            "If your problem is strategic direction, then producing more content won't suddenly create growth.",
            "The right solution depends on the actual constraint.",
            "That's exactly why I'm hosting a free workshop:",
            "How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "During this workshop, I'll break down:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system around those goals",
            "\u2713 The exact framework that helped a clothing brand grow generate $7,650 in sales from just $965 in ad spend",
            "If you're tired of guessing what's actually holding your brand back, this workshop is for you.",
            "[REGISTER FOR FREE]",
            "P.S. Most founders don't need more information.",
            "They need greater clarity about what deserves their attention next."
        ]
    },
    {
        id: "pre_promo_2", triggerHours: 120, subject: "Quick question about your growth strategy",
        body: [
            "Quick question - do you ever feel like you're throwing money into a black hole when it comes to Facebook ads?",
            "Like you're constantly testing new audiences, new creatives, new copy... but nothing seems to stick?",
            "If so, I get it.",
            "Even successful clothing brands I work with tell me the same thing...",
            "\"Yasser, I'm spending $10K a month on ads, but I never know which ones will work. It's like gambling with my business.\"",
            "My solution?",
            "Stop testing everything and START with psychology.",
            "If you're not a mind reader, don't have years of advertising experience, or haven't spent $100K+ learning what works...",
            "I've got something MUCH better to show you.",
            "It's called the \"One Irresistible Ad Formula\" - and it's specifically designed for clothing brand owners who want predictable profits, not expensive experiments.",
            "So if you're interested in hitting consistent $10K+ monthly profit without burning through your budget, you won't want to miss my upcoming FREE webinar:",
            "\"The One Ad That Changes Everything: How Clothing Brand Owners Are Hitting Consistent $10K+ Monthly Profit in 90 Days\"",
            "In this live training, you'll discover:",
            "Why your competitors are failing (and how to capitalize on their mistakes)",
            "The exact psychology that turns browsers into buyers for clothing brands",
            "My \"Zero-Risk Roadmap System\" - know it'll work BEFORE you spend a dollar",
            "And...",
            "I'll also reveal a special case study of how one streetwear brand went from competing with everyone to having customers specifically seek them out.",
            "Even if you've tried everything before and failed.",
            "Trust me, you don't want to miss this.",
            "Click here to secure your spot: [Registration Link]",
            "P.S. Still skeptical? I get it. But I'm so confident in the power of this system, I'll be sharing LIVE case studies during the webinar.",
            "Real brands. Real results. Real profits.",
            "That's right - this will ONLY be available to people who make it live.",
            "Register here to see the proof: [Registration Link]"
        ]
    },
    {
        id: "pre_promo_3", triggerHours: 72, subject: "The uncomfortable truth about clothing brands",
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
            "Because growth doesn't come from fixing random problems.",
            "Growth comes from identifying and solving the right problem.",
            "That's the uncomfortable truth.",
            "Most founders don't know what's actually holding their business back.",
            "And because they don't know, they end up spreading their attention across dozens of different initiatives.",
            "The result?",
            "Lots of activity.",
            "Very little progress.",
            "That's exactly why I'm hosting this workshop:",
            "How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "Inside, I'll walk you through:",
            "\u2713 Why most clothing brands stay stuck for years",
            "\u2713 How to identify the biggest constraint limiting growth",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system around those goals",
            "\u2713 The exact framework behind a brand's growth generate $7,650 in sales from just $965 in ad spend",
            "The goal isn't to give you more tactics.",
            "The goal is to help you identify what actually deserves your attention next.",
            "Reserve your seat here:",
            "[REGISTER FOR FREE]",
            "P.S. Most founders already know enough marketing to grow.",
            "The challenge is knowing which problem deserves to be solved first."
        ]
    },
    {
        id: "pre_promo_4", triggerHours: 48, subject: "How a \"generic\" streetwear brand hit $100K/month (real story)",
        body: [
            "I want to share a story with you.",
            "A while ago, I worked with a clothing brand owner named Abdul.",
            "At the time, he was struggling to get consistent sales with their drops.",
            "The business wasn't failing.",
            "But it wasn't growing the way he wanted either.",
            "Every attempt to scale seemed to create new problems.",
            "More spending.",
            "More complexity.",
            "More uncertainty.",
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
            "Revenue went from inconsistent sales to selling 153 hoodies in 30 days.",
            "Over time, the business generated over $7,650 in sales from just $965 in ad spend.",
            "Not because we worked harder.",
            "But because we focused on the right problem.",
            "That's exactly what we'll be discussing during the workshop:",
            "How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "Inside, I'll walk you through:",
            "\u2713 Why most clothing brands stay stuck for years",
            "\u2713 How to identify the biggest constraint limiting growth",
            "\u2713 How to define a clear vision and growth targets",
            "\u2713 How to build a customer acquisition system around those goals",
            "\u2713 The framework we use to turn clarity into consistent growth",
            "If you're tired of guessing what deserves your attention next, I think you'll find this valuable.",
            "[REGISTER FOR FREE]",
            "P.S. Most founders assume growth comes from finding the right tactic.",
            "In my experience, growth usually comes from identifying the right bottleneck first."
        ]
    },
    {
        id: "pre_promo_5", triggerHours: 24, subject: "Tomorrow: How a clothing brand added $1.2M in revenue",
        body: [
            "Tomorrow's the day.",
            "I've just finished preparing the workshop, and I genuinely think it's going to challenge the way many clothing brand owners think about growth.",
            "Because here's what I've noticed after consulting hundreds of brands:",
            "Most founders aren't struggling because they lack information.",
            "They're struggling because they haven't accurately identified what's actually limiting growth.",
            "And when you're solving the wrong problem, even great execution can produce disappointing results.",
            "That's exactly what we'll be covering tomorrow.",
            "How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "Inside the workshop, I'll walk you through:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system around those goals",
            "\u2713 How to execute, measure, and improve performance without relying on guesswork",
            "We'll also break down real-world examples, including the frameworks behind brands that grew generate $7,650 in sales from just $965 in ad spend.",
            "The workshop starts tomorrow at:",
            "[DATE]",
            "[TIME]",
            "Reserve your seat here:",
            "[REGISTRATION LINK]",
            "My goal isn't to give you more tactics.",
            "My goal is to help you gain clarity on what actually deserves your attention next.",
            "P.S. Before the workshop, ask yourself this question:",
            "\"What do I believe is currently preventing my brand from growing?\"",
            "Write down your answer.",
            "Bring it with you tomorrow."
        ]
    },
    {
        id: "pre_promo_6", triggerHours: 6, subject: "Going LIVE in [X hours] - Your breakthrough awaits",
        body: [
            "We're going live in just a few hours.",
            "And before we do, I want to ask you one question:",
            "What do you believe is currently preventing your clothing brand from growing?",
            "More traffic?",
            "Better ads?",
            "Higher conversion rates?",
            "More content?",
            "A stronger offer?",
            "Most founders have an answer.",
            "The challenge is that many of those answers are wrong.",
            "Not because founders aren't smart.",
            "But because it's incredibly difficult to diagnose your own business objectively.",
            "That's exactly what today's workshop is about.",
            "How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "Inside, I'll walk you through:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system around those goals",
            "\u2713 How to execute, measure, and improve performance without relying on guesswork",
            "We'll also break down real-world examples, including the frameworks behind brands that grew generate $7,650 in sales from just $965 in ad spend.",
            "The workshop starts at:",
            "[TIME]",
            "Join here:",
            "[REGISTRATION LINK]",
            "And yes, we'll also have time for questions and discussion.",
            "If you've ever felt like you're working hard but still unsure what deserves your attention next, I think you'll find today's training valuable.",
            "P.S. Bring a notebook.",
            "The founders who get the most value from this workshop are usually the ones who arrive ready to challenge their assumptions about what's actually limiting growth.",
            "",
            "",
            "",
            "",
            "",
            "",
            "Registration Confirmation & Reminder Emails"
        ]
    },
    {
        id: "immediate_welcome2", triggerHours: 999999, subject: "You're In! Your Registration Is Confirmed",
        body: [
            "You're officially registered."
        ]
    },
    {
        id: "rem_1d", triggerHours: 24, subject: "Are we still on for tomorrow?",
        body: [
            "Just a quick reminder that our workshop is happening tomorrow at [TIME].",
            "Here's the join link:",
            "[LINK]",
            "Tomorrow, I'll be walking you through the exact process we used to help a clothing brand sell 153 hoodies in 30 days.",
            "More importantly, I'll show you how we identified the bottleneck that was preventing growth before we ever discussed ads, content, or customer acquisition.",
            "Here's what you'll learn:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the single biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets that make decision-making dramatically easier",
            "\u2713 How to design a customer acquisition system that supports your goals instead of creating more complexity",
            "\u2713 How to execute, measure, and improve performance without relying on guesswork or chasing trends",
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
            "Time: [TIME]",
            "Join Link: [LINK]",
            "Before we go live, I'd like you to think about something.",
            "If your clothing brand doubled in size over the next 12 months, what would have needed to change?",
            "Most owners immediately think:",
            "\"Better ads.\"",
            "\"More traffic.\"",
            "\"More content.\"",
            "But after consulting hundreds of clothing brands, I've found that growth usually isn't limited by effort.",
            "It's limited by a constraint.",
            "One bottleneck.",
            "One decision.",
            "One problem that, when solved, makes everything else easier.",
            "Today's workshop is designed to help you identify that constraint.",
            "We'll walk through the exact root cause analysis, growth strategy, and customer acquisition framework behind a clothing brand's journey from $35k/month to consistent $100k+ months.",
            "You'll leave with:",
            "\u2713 A clearer understanding of what's actually limiting growth",
            "\u2713 A framework for defining your next growth target",
            "\u2713 A system for aligning your marketing with your business objectives",
            "\u2713 A practical approach for measuring and improving performance over time",
            "A quick favor:",
            "Bring a notebook.",
            "Bring an open mind.",
            "And come prepared to challenge some assumptions about what's really holding your brand back.",
            "Your seat is reserved.",
            "I'll see you in a few hours.",
            "Yasir Sultan",
            "Founder, Zen Focus Media",
            "P.S. Most founders leave workshops looking for new tactics. My goal is to help you leave with something more valuable: clarity on what deserves your attention next."
        ]
    },
    {
        id: "rem_1h", triggerHours: 1, subject: "We start in ONE hour!",
        body: [
            "We go live in one hour.",
            "Time: [TIME]",
            "Join Link: [LINK]",
            "In the next 60 minutes, you'll get an inside look at How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad.",
            "More importantly, you'll learn the process we used to identify the bottlenecks that were preventing growth long before we discussed ads, content, or customer acquisition.",
            "Here's what we'll cover:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system that supports your goals",
            "\u2713 How to execute, measure, and improve performance without relying on guesswork",
            "Before joining, take 30 seconds to answer this question:",
            "\"What do I believe is currently preventing my brand from growing?\"",
            "Write down your answer.",
            "Then compare it to the framework we'll cover during the workshop.",
            "You may discover that the real bottleneck is completely different from what you originally thought.",
            "Your seat is reserved.",
            "All that's left is to show up.",
            "P.S. The founders who get the most value from this workshop aren't necessarily the smartest or most experienced. They're the ones willing to challenge their assumptions and look at their business objectively."
        ]
    },
    {
        id: "rem_live", triggerHours: 0, subject: "We're Live \u2014 Join Us Now",
        body: [
            "We're live right now.",
            "Join here: [LINK]",
            "Today we're breaking down:",
            "\u2022 How We Helped A Streetwear Brand Sell 153 Hoodies In 30 Days With One Viral Ad",
            "\u2022 The root cause analysis process we used to identify the bottlenecks limiting growth",
            "\u2022 The growth strategy and customer acquisition system behind their journey from $35k/month to consistent $100k+ months",
            "\u2022 The framework you can use to identify what's actually preventing your own clothing brand from growing",
            "If you've ever felt like you're working hard but still unsure what's truly holding your business back, this workshop is for you.",
            "Click below and join us now:",
            "[LINK]",
            "P.S. Most founders leave with at least one realization that changes how they think about growth. Don't miss it.",
            "",
            "",
            "",
            "",
            "",
            "Post-Webinar Replay Emails"
        ]
    },
    {
        id: "post_0h", triggerHours: -2, subject: "Here's your workshop replay (available for 72 hours)",
        body: [
            "If you missed the workshop, don't worry.",
            "I've made the replay available for the next 72 hours.",
            "Watch the replay here:",
            "[REPLAY LINK]",
            "During the workshop, we broke down how a clothing brand grew generate $7,650 in sales from just $965 in ad spend and sold 153 hoodies in 30 days.",
            "But the most important lesson wasn't the revenue.",
            "It was the process.",
            "Specifically:",
            "How we identified the bottleneck that was limiting growth before spending more money on ads, content, or influencers.",
            "Inside the replay, you'll learn:",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to identify the biggest constraint limiting growth in your business",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system around your objectives",
            "\u2713 How to execute, measure, and improve performance over time",
            "One of the biggest mistakes I see founders make is assuming they know what's holding them back.",
            "Often, the real bottleneck is somewhere else entirely.",
            "And until that bottleneck is identified, every new tactic feels like another shot in the dark.",
            "That's exactly why I recommend watching the replay before it comes down.",
            "Watch the replay here:",
            "[REPLAY LINK]",
            "The replay will only be available for the next 72 hours.",
            "After that, it will be removed.",
            "P.S. As you're watching, ask yourself one question:",
            "\"What do I believe is currently preventing my brand from growing?\"",
            "Then compare your answer to the framework we cover in the workshop. That exercise alone could be worth the entire training."
        ]
    },
    {
        id: "post_24h", triggerHours: -24, subject: "I'm taking this down soon (and most founders miss this point)",
        body: [
            "The workshop replay is still available, but not for much longer.",
            "Watch it here:",
            "[REPLAY LINK]",
            "As I've been reflecting on the workshop, there's one idea that keeps coming back to me.",
            "Most clothing brands don't fail because they lack effort.",
            "They fail because they misdiagnose the problem.",
            "Think about it.",
            "If a founder believes their problem is traffic, they'll buy more ads.",
            "If they believe their problem is content, they'll post more content.",
            "If they believe their problem is conversion, they'll redesign their website.",
            "But what happens if none of those are actually the bottleneck?",
            "Now they're working harder...",
            "Spending more money...",
            "Testing more tactics...",
            "Yet seeing little progress.",
            "That's why the first thing we focus on isn't ads.",
            "It isn't content.",
            "It isn't influencers.",
            "It's diagnosis.",
            "Because the right solution depends on the actual constraint.",
            "Inside the workshop replay, I walk through the same process we used to identify the bottleneck limiting growth for a clothing brand that eventually went on to sell 153 hoodies in 30 days.",
            "You'll also see:",
            "\u2713 Why most clothing brands stay stuck for years",
            "\u2713 How to identify the biggest growth constraint in your business",
            "\u2713 How to define a clear vision and growth targets",
            "\u2713 How to build a customer acquisition system that supports those goals",
            "\u2713 How to measure and improve performance without guessing",
            "Watch the replay here:",
            "[REPLAY LINK]",
            "The replay will be removed soon.",
            "And once it's gone, it won't be available again.",
            "P.S. Here's a question worth thinking about:",
            "If your brand doubled over the next 12 months, what would have needed to change?",
            "Your answer to that question might reveal more than you think."
        ]
    },
    {
        id: "post_48h", triggerHours: -48, subject: "Most founders never identify this bottleneck",
        body: [
            "The workshop replay comes down in less than 24 hours.",
            "Watch it here:",
            "[REPLAY LINK]",
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
            "Correct diagnosis comes before effective action.",
            "Inside the replay, you'll see the exact framework we used to identify the bottleneck limiting growth for a clothing brand that eventually sold 153 hoodies in 30 days.",
            "You'll also learn:",
            "\u2713 Why most clothing brands stay stuck for years",
            "\u2713 How to define a clear vision and growth targets",
            "\u2713 How to build a customer acquisition system around your goals",
            "\u2713 How to execute, measure, and improve performance over time",
            "And if you're interested in working with us directly, I also explain how we help clothing brands identify their biggest growth constraints and build a strategy around them.",
            "Watch the replay here:",
            "[REPLAY LINK]",
            "The replay will be removed in less than 24 hours.",
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
            "Watch it here before it's removed:",
            "[REPLAY LINK]",
            "One of the most common reactions we've received is surprisingly simple:",
            "\"I finally understand what I've been missing.\"",
            "Not because we shared some secret ad hack.",
            "Not because we revealed a magic funnel.",
            "But because many founders realize they've been investing time, money, and energy into solving the wrong problem.",
            "Inside the workshop, we break down:",
            "\u2713 How we helped a clothing brand sell 153 hoodies in 30 days",
            "\u2713 The root cause analysis process we used to identify the bottleneck limiting growth",
            "\u2713 Why most clothing brands stay stuck for years despite constantly trying new tactics",
            "\u2713 How to define a clear vision, purpose, and growth targets",
            "\u2713 How to build a customer acquisition system that supports those goals",
            "\u2713 How to execute, measure, and improve performance without relying on guesswork",
            "The replay disappears tonight.",
            "After that, it won't be available.",
            "Watch it here before it's gone:",
            "[REPLAY LINK]",
            "P.S. Most founders are only one insight away from making dramatically better decisions.",
            "The challenge is that many never discover what that insight is.",
            "Don't let the replay disappear before you've had a chance to watch it.",
            "",
            "",
            "Cart Close/Countdown Promo Emails"
        ]
    },
    {
        id: "cart_close_1", triggerHours: -96, subject: "{{contact.first_name}}, is this you?",
        body: [
            "Let me ask you something.",
            "Does this sound familiar?",
            "You've invested time into ads.",
            "You've experimented with content.",
            "You've tested different offers.",
            "You've consumed countless marketing videos.",
            "Yet growth still feels slower and harder than it should.",
            "Not because you're lazy.",
            "Not because you're incapable.",
            "But because you're not completely certain what's actually limiting growth.",
            "One month you think it's traffic.",
            "The next month you think it's conversion.",
            "Then you think it's retention.",
            "Then you think it's your creatives.",
            "And before long, you're running in circles trying to solve five different problems at once.",
            "That's exactly why I created this offer.",
            "After helping hundreds of clothing brands and studying the growth patterns behind successful companies, I realized something:",
            "Most founders don't need more tactics.",
            "They need clarity.",
            "They need a way to identify the real bottleneck limiting growth and a plan for addressing it.",
            "That's what we help with.",
            "Inside the program, we'll help you:",
            "\u2713 Identify the biggest constraint limiting growth",
            "\u2713 Define clear growth targets and business objectives",
            "\u2713 Build a customer acquisition system aligned with those goals",
            "\u2713 Create a roadmap for execution and optimization",
            "\u2713 Focus your resources on the highest-leverage opportunities",
            "This is the same thinking process that helped one clothing brand sell 153 hoodies in 30 days.",
            "Enrollment is now open.",
            "[BUTTON: Apply Now]",
            "But not for long.",
            "Enrollment closes in 5 days.",
            "[COUNTDOWN TIMER]",
            "If you're tired of guessing what's holding your brand back and want a clearer path forward, now is the time.",
            "P.S. The costliest mistake isn't making the wrong decision.",
            "It's spending the next 6-12 months solving a problem that isn't actually limiting growth."
        ]
    },
    {
        id: "cart_close_2", triggerHours: -120, subject: "If you think you don't have time, read this...",
        body: [
            "One of the most common objections I hear from clothing brand owners is:",
            "\"I don't have time for this right now.\"",
            "And honestly?",
            "I understand.",
            "You're managing inventory.",
            "Handling customers.",
            "Working with suppliers.",
            "Dealing with fulfillment.",
            "Trying to grow the business.",
            "There's always something demanding your attention.",
            "But here's the question I would ask:",
            "Do you have time to spend the next 6 months solving the wrong problem?",
            "Because that's usually what happens.",
            "A founder thinks they need better ads.",
            "So they spend months improving ads.",
            "Another founder thinks they need more content.",
            "So they spend months creating content.",
            "Another believes they need a website redesign.",
            "So they spend months rebuilding pages.",
            "Yet growth barely changes.",
            "Not because those things don't matter.",
            "But because they weren't the bottleneck.",
            "The challenge isn't effort.",
            "The challenge is knowing where effort should be directed.",
            "That's exactly why we built this program.",
            "Our goal isn't to give you more marketing tactics.",
            "Our goal is to help identify the constraint limiting growth and build a strategy around solving it.",
            "Inside the program, we'll help you:",
            "\u2713 Identify what's actually holding your brand back",
            "\u2713 Define clear growth objectives",
            "\u2713 Build a customer acquisition system aligned with those objectives",
            "\u2713 Create an execution roadmap",
            "\u2713 Focus your resources on the highest-leverage opportunities",
            "If you've ever felt like you're working hard but still unsure what deserves your attention next, this was built for you.",
            "[BUTTON: Apply Now]",
            "Enrollment closes in less than 4 days.",
            "[COUNTDOWN TIMER]",
            "P.S. Most founders don't need to work harder.",
            "They need greater certainty about where to focus their effort."
        ]
    },
    {
        id: "cart_close_3", triggerHours: -144, subject: "Why most clothing brands fail (and why this works)",
        body: [
            "Why do some clothing brands seem to grow year after year while others stay stuck?",
            "After consulting hundreds of founders, I've noticed something interesting.",
            "The brands that struggle the most aren't necessarily less talented.",
            "They aren't working less.",
            "And they don't care less.",
            "They're simply focused on the wrong thing.",
            "One founder believes the problem is ads.",
            "Another believes it's content.",
            "Another believes it's conversion.",
            "Another believes it's the economy.",
            "Everyone is busy.",
            "Everyone is taking action.",
            "Yet growth remains frustratingly slow.",
            "Why?",
            "Because effort only compounds when it's directed at the right constraint.",
            "Imagine trying to increase water flow through a pipe.",
            "You can increase pressure all day long.",
            "But if there's a blockage somewhere in the system, nothing changes until the blockage is removed.",
            "Business growth works the same way.",
            "The founders who grow fastest aren't necessarily doing more.",
            "They're identifying the bottleneck and focusing on removing it.",
            "That's exactly what we help clothing brands do.",
            "Inside the program, we help you:",
            "\u2713 Identify the biggest constraint limiting growth",
            "\u2713 Define a clear vision and growth targets",
            "\u2713 Build a customer acquisition system around those objectives",
            "\u2713 Create a roadmap for execution and optimization",
            "\u2713 Focus resources where they'll create the greatest impact",
            "This is the same process that helped one clothing brand grow generate $7,650 in sales from just $965 in ad spend and sell 153 hoodies in 30 days.",
            "If you're tired of guessing what deserves your attention next, this may be exactly what you're looking for.",
            "[BUTTON: Apply Now]",
            "Enrollment closes in less than 3 days.",
            "[COUNTDOWN TIMER]",
            "P.S. Most founders don't have a marketing problem.",
            "They have a prioritization problem.",
            "Once the right bottleneck becomes clear, many decisions become surprisingly easy."
        ]
    },
    {
        id: "cart_close_4", triggerHours: -168, subject: "Look what happened to Mikael...",
        body: [
            "I want to tell you about Mikael.",
            "When we first started working together, his clothing brand was struggling to sell out his drops without spending his entire profit margin on ads.",
            "On paper, things looked okay.",
            "But in reality?",
            "The business was under constant pressure.",
            "Margins were thin.",
            "Growth felt difficult.",
            "Every attempt to scale seemed to create new problems.",
            "And despite working incredibly hard, Mikael wasn't building the business he envisioned.",
            "Sound familiar?",
            "The interesting part is that the solution wasn't simply \"better ads.\"",
            "It wasn't a new funnel.",
            "It wasn't a secret marketing tactic.",
            "The first step was identifying the constraint limiting growth.",
            "Because until you understand what's actually preventing progress, every solution becomes guesswork.",
            "Once we identified the bottleneck, we were able to:",
            "\u2713 Clarify growth objectives",
            "\u2713 Align acquisition strategy with those objectives",
            "\u2713 Improve decision making across the business",
            "\u2713 Create a more scalable path forward",
            "The result?",
            "He sold 153 hoodies in 30 days with a single viral ad.",
            "He spent only $965 on ads and generated $7,650 in sales.",
            "[SCREENSHOT: Mikael Results]",
            "More importantly, Mikael stopped operating from uncertainty.",
            "He had a clear understanding of what mattered, what didn't, and where resources should be focused.",
            "That's exactly what we help clothing brands do.",
            "Inside the program, we'll help you:",
            "\u2713 Identify the biggest constraint limiting growth",
            "\u2713 Define a clear vision and growth targets",
            "\u2713 Build a customer acquisition system aligned with those goals",
            "\u2713 Create an execution roadmap",
            "\u2713 Optimize based on data rather than guesswork",
            "If you're tired of feeling like growth is harder than it should be, this may be the next step.",
            "[BUTTON: Apply Now]",
            "Enrollment closes in less than 2 days.",
            "[COUNTDOWN TIMER]",
            "P.S. Most founders assume they need a better strategy.",
            "Often, what they actually need is a better diagnosis."
        ]
    },
    {
        id: "cart_close_5", triggerHours: -192, subject: "Bad news about the price...",
        body: [
            "I've got some bad news.",
            "Enrollment closes soon.",
            "And once it does, this offer will no longer be available at its current pricing.",
            "[COUNTDOWN TIMER]",
            "Over the last few days, I've spoken with several clothing brand owners who all asked some version of the same question:",
            "\"How do I know if this is worth the investment?\"",
            "It's a fair question.",
            "But I think there's a better one.",
            "What's the cost of continuing without clarity?",
            "Think about the next 12 months.",
            "How much time, money, and energy could be wasted if you're focused on the wrong bottleneck?",
            "How many campaigns?",
            "How many website changes?",
            "How many new tactics?",
            "How many months are spent trying to solve a problem that isn't actually limiting growth?",
            "That's the real risk.",
            "Inside the program, we're not simply helping you run ads.",
            "We're helping you:",
            "\u2713 Identify the biggest constraint limiting growth",
            "\u2713 Define a clear vision and growth objectives",
            "\u2713 Build a customer acquisition system aligned with those goals",
            "\u2713 Create a roadmap for execution and optimization",
            "\u2713 Focus resources on the highest-leverage opportunities",
            "This is the same framework that helped a clothing brand grow generate $7,650 in sales from just $965 in ad spend and sell 153 hoodies in 30 days.",
            "The investment is $6,000 USD.",
            "Or 3 payments of $3,000.",
            "[BUTTON: Apply Now]",
            "Enrollment closes soon.",
            "And once it does, the opportunity to work together at this level will be gone.",
            "P.S. Most founders don't lose because they make one terrible decision.",
            "They lose because they spend months\u2014or years\u2014making reasonable decisions based on an incorrect diagnosis.",
            "That's what we're trying to prevent."
        ]
    },
    {
        id: "cart_close_6", triggerHours: -216, subject: "A question about your future...",
        body: [
            "I want you to imagine something.",
            "Imagine sitting down to work on your business and knowing exactly what deserves your attention.",
            "Not guessing.",
            "Not bouncing between tactics.",
            "Not wondering whether you should focus on ads, content, influencers, conversion rate optimization, email marketing, or something else.",
            "Just clarity.",
            "Imagine knowing:",
            "What your biggest bottleneck is.",
            "What your growth target is.",
            "What your priorities are.",
            "And what needs to happen next.",
            "Imagine making decisions with confidence because you have a clear roadmap rather than a collection of disconnected tactics.",
            "Imagine building your business knowing that every action is moving you closer to a specific destination.",
            "That's the real outcome we're helping founders create.",
            "Not just more revenue.",
            "Not just more traffic.",
            "Not just more marketing activity.",
            "Clarity.",
            "Direction.",
            "Focus.",
            "Because once those things exist, growth becomes much easier.",
            "This is exactly what happened for the founders we've worked with.",
            "A clothing brand that grew generate $7,650 in sales from just $965 in ad spend.",
            "A founder who increased monthly profit significantly.",
            "Multiple brands that stopped guessing and started operating with a clear plan.",
            "[SCREENSHOTS / RESULTS]",
            "The results are impressive.",
            "But what created those results was clarity.",
            "And that's what this program is designed to help you build.",
            "Enrollment closes in less than 48 hours.",
            "[COUNTDOWN TIMER]",
            "If you're ready to stop guessing and start building with intention, now is the time.",
            "[BUTTON: Apply Now]",
            "P.S. Most founders don't need more information.",
            "They need greater certainty about what to do next."
        ]
    },
    {
        id: "cart_close_7", triggerHours: -240, subject: "24 hours warning.",
        body: [
            "This is your final 24-hour warning.",
            "In less than 24 hours, enrollment closes.",
            "[COUNTDOWN TIMER]",
            "Over the last few days, I've shared frameworks, case studies, and examples of what's possible when a founder identifies the right bottleneck and builds a strategy around it.",
            "Now I'd like to leave you with one final thought.",
            "Most founders don't fail because they make bad decisions.",
            "They fail because they make reasonable decisions based on incomplete information.",
            "They improve ads when the problem isn't ads.",
            "They create more content when the problem isn't content.",
            "They redesign websites when the problem isn't conversion.",
            "They work harder and harder...",
            "Yet growth barely changes.",
            "Not because they're incapable.",
            "But because they're focused on the wrong thing.",
            "That's exactly why we built this program.",
            "To help founders identify:",
            "\u2713 What's actually limiting growth",
            "\u2713 Where resources should be focused",
            "\u2713 What the next priority should be",
            "\u2713 How to build a strategy around that reality",
            "Because once the right bottleneck becomes clear, many decisions become dramatically easier.",
            "The opportunity to work together closes in less than 24 hours.",
            "[BUTTON: Apply Now]",
            "After that, enrollment will be closed.",
            "P.S. The most expensive mistake isn't making the wrong move.",
            "It's spending the next 12 months solving a problem that was never limiting growth in the first place."
        ]
    },
    {
        id: "cart_close_8", triggerHours: -264, subject: "Final hours (enrollment closing)",
        body: [
            "Just a quick heads up.",
            "Enrollment closes in less than 6 hours.",
            "[COUNTDOWN TIMER]",
            "If you've been considering joining, now is the time to make a decision.",
            "Inside the program, we'll help you:",
            "\u2713 Identify the biggest constraint limiting growth",
            "\u2713 Define clear growth objectives",
            "\u2713 Build a customer acquisition system aligned with those objectives",
            "\u2713 Create a roadmap for execution and optimization",
            "\u2713 Focus your resources on the highest-leverage opportunities",
            "This is the same framework that helped one clothing brand grow generate $7,650 in sales from just $965 in ad spend and sell 153 hoodies in 30 days.",
            "The question isn't whether your business can grow.",
            "The question is whether you're focused on the right bottleneck.",
            "If you're ready to stop guessing and start operating with greater clarity, we'd love to help.",
            "[BUTTON: Apply Now]",
            "Enrollment closes in less than 6 hours.",
            "After that, the opportunity disappears.",
            "P.S. The founders who get the best results are rarely the ones who know the most.",
            "They're the ones who gain clarity the fastest and act on it."
        ]
    },
    {
        id: "cart_close_9", triggerHours: -288, subject: "FINAL HOURS \u2014 Don't make this mistake",
        body: [
            "Enrollment closes in less than 2 hours.",
            "[COUNTDOWN TIMER]",
            "Before we close, I want to leave you with one final thought.",
            "Over the years, I've worked with founders who invested months\u2014and sometimes years\u2014trying to grow their brands.",
            "They weren't lazy.",
            "They weren't unintelligent.",
            "They weren't lacking ambition.",
            "They were simply focused on the wrong bottleneck.",
            "And that's what made growth so frustrating.",
            "They kept working.",
            "Kept testing.",
            "Kept spending.",
            "Yet progress felt slower than it should.",
            "The tragedy wasn't the effort.",
            "The tragedy was directing that effort toward the wrong problem.",
            "That's why this decision matters.",
            "Not because joining magically guarantees success.",
            "But because clarity changes everything.",
            "When you understand:",
            "\u2713 What's actually limiting growth",
            "\u2713 What deserves your attention",
            "\u2713 What your next priority should be",
            "\u2713 How your customer acquisition system should support your goals",
            "Decision-making becomes dramatically easier.",
            "That's exactly what we help founders build.",
            "Enrollment closes in less than 2 hours.",
            "[BUTTON: Apply Now]",
            "After that, applications will be closed.",
            "P.S. The mistake I see most often isn't taking action and failing.",
            "It's spending another year working hard on a problem that was never limiting growth in the first place."
        ]
    },
    {
        id: "cart_close_10", triggerHours: -312, subject: "FINAL CALL - Cart closing in 30 minutes",
        body: [
            "This is it.",
            "Enrollment closes in 30 minutes.",
            "[COUNTDOWN TIMER]",
            "If you've been waiting to make a decision, now is the time.",
            "Over the last few days, we've discussed a simple idea:",
            "Most clothing brands don't struggle because they lack effort.",
            "They struggle because they're focused on the wrong bottleneck.",
            "Inside the program, we'll help you:",
            "\u2713 Identify what's actually limiting growth",
            "\u2713 Define clear growth objectives",
            "\u2713 Build a customer acquisition system aligned with those goals",
            "\u2713 Create a roadmap for execution and optimization",
            "This is the same framework that helped a clothing brand grow generate $7,650 in sales from just $965 in ad spend and sell 153 hoodies in 30 days.",
            "In 30 minutes, enrollment closes.",
            "No extensions.",
            "No exceptions.",
            "[BUTTON: APPLY NOW]",
            "Whatever you decide, I appreciate you following along.",
            "P.S. The goal isn't to do more.",
            "The goal is to focus on what matters most."
        ]
    },
    {
        id: "cart_close_11", triggerHours: -336, subject: "Enrollment is now officially closed",
        body: [
            "That's it.",
            "Enrollment is now officially closed.",
            "Applications are no longer being accepted.",
            "To everyone who decided to join us, thank you for your trust.",
            "Over the coming days, we'll begin working together to identify the constraints limiting growth, clarify your objectives, and build a strategy designed around your specific business.",
            "You'll receive your welcome email and onboarding information shortly.",
            "Be sure to check your inbox (and spam folder) for an email titled:",
            "\"Welcome \u2014 Next Steps\"",
            "To everyone who chose not to join, I sincerely appreciate you following along throughout the workshop and email series.",
            "My hope is that one idea sticks with you:",
            "Growth becomes much easier when you identify the right bottleneck.",
            "Whether you work with us or not, I encourage you to continue asking:",
            "\"What is actually limiting growth right now?\"",
            "Because the answer to that question often changes everything.",
            "Thank you again for your time and attention.",
            "I wish you and your brand nothing but success.",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "Calendly link: (Apply NOW) \u2192 https://calendly.com/60min-scaling/strategy-call"
        ]
    },
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