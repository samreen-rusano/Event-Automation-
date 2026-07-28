export interface EmailData {
    id: string;
    subject: string;
    html: string;
}

export function renderHtml(firstName: string, lines: string[]): string {
    const bgLight = "#F4F5F7";
    const textDark = "#162228";
    const textMuted = "#45606D";

    const formattedLines = lines.map(line => {
        if (!line.trim()) return "<br/>";
        // Handle links
        if (line.startsWith("http")) {
            return `<p style="font-size: 16px; margin: 0 0 16px 0;"><a href="${line}" style="color: #FF6B00; font-weight: bold;">${line}</a></p>`;
        }
        return `<p style="font-size: 16px; font-weight: 400; color: ${textMuted}; margin: 0 0 16px 0; line-height: 1.6;">${line.replace(/\*name\*/gi, firstName).replace(/Name/g, firstName)}</p>`;
    }).join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgLight}; font-family: sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; padding: 40px;">
                    <tr>
                        <td>
                            ${formattedLines}
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

export const emails = {
    email1: {
        id: "email1",
        subject: "Thank you for your Order",
        body: [
            "Hey *name*",
            "Appreciate your order.",
            "Please click this google drive link to access your One Viral Ad framework",
            "https://drive.google.com/drive/folders/1enjOKGdNzdN6E36fnz3-ho_kETd2yqSN",
            "If you have any questions, please email us back here and I'll get back to you within 24 hours."
        ]
    },
    email2: {
        id: "email2",
        subject: "Thank you for your Order",
        body: [
            "Hey *name*",
            "Appreciate your order.",
            "Please click this google drive link to access your One Viral Ad framework",
            "And the SOP:",
            "https://drive.google.com/drive/folders/1D0HstKyzE2ZFq6ODvBHA0seXKvIUSakI",
            "If you have any questions, please email us back here and I'll get back to you within 24 hours."
        ]
    },
    email3: {
        id: "email3",
        subject: "Thank you for your Order",
        body: [
            "Hi Name,",
            "Thank you for your order!",
            "Please click the Google Drive link below to access your One Viral Ad Framework and the accompanying SOP:",
            "https://drive.google.com/drive/folders/1D0HstKyzE2ZFq6ODvBHA0seXKvIUSakI",
            "Since you've also purchased our 7-Day Build Your Viral Ad With Us program, we'll be adding you to our Slack workspace using the email address you provided during checkout.",
            "If you'd prefer us to use a different email address, simply reply to this email with the one you'd like us to use.",
            "Your 7-day challenge will begin once you've been added to Slack and we've exchanged greetings.",
            "If you have any questions, just reply to this email and I'll get back to you within 24 hours.",
            "Looking forward to working with you!",
            "Yasir Sultan"
        ]
    }
};

export function getEmailForPurchase(purchasedItems: string[], firstName: string): EmailData | null {
    if (!purchasedItems || purchasedItems.length === 0) return null;

    let template = emails.email1; // default

    const hasFramework = purchasedItems.includes("framework");
    const hasOrderBump = purchasedItems.includes("order_bump");
    const hasUpsell = purchasedItems.includes("upsell");

    if (hasFramework && hasOrderBump && hasUpsell) {
        template = emails.email3;
    } else if (hasFramework && hasOrderBump) {
        template = emails.email2;
    } else if (hasFramework) {
        template = emails.email1;
    } else {
        // Fallback for upsell-only confirmation if they hit upsell separately but we expect framework too
        template = emails.email3; 
    }

    return {
        id: template.id,
        subject: template.subject,
        html: renderHtml(firstName, template.body)
    };
}
