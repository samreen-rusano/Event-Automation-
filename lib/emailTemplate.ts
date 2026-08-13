export interface EmailData {
    id: string;
    subject: string;
    html: string;
}

export function renderHtml(lines: string[]): string {
    const formattedLines = lines.map(line => {
        if (!line.trim()) return "<br/>";
        // Handle links
        if (line.startsWith("http")) {
            return `<p style="font-size: 16px; margin: 0 0 16px 0;"><a href="${line}" style="color: #0000FF; text-decoration: underline;">${line}</a></p>`;
        }
        return `<p style="font-size: 16px; font-weight: 400; color: #000000; margin: 0 0 16px 0; line-height: 1.6;">${line}</p>`;
    }).join("\n");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: sans-serif;">
    <div style="padding: 20px;">
        ${formattedLines}
    </div>
</body>
</html>
    `;
}

export const emails = {
    email1: {
        id: "email1",
        subject: "Your One Viral Ad Framework",
        body: [
            "Thank you for your purchase and for trusting me.",
            "",
            "Please click the link below to access the One Viral Ad Framework.",
            "",
            "https://drive.google.com/drive/folders/1enjOKGdNzdN6E36fnz3-ho_kETd2yqSN",
            "",
            "Cheers,",
            "Yasir"
        ]
    },
    email2: {
        id: "email2",
        subject: "Your One Viral Ad Framework + SOP",
        body: [
            "Thank you for your purchase and for trusting me.",
            "",
            "Please click the link below to access the One Viral Ad Framework and the SOP.",
            "",
            "https://drive.google.com/drive/folders/1D0HstKyzE2ZFq6ODvBHA0seXKvIUSakI",
            "",
            "Cheers,",
            "Yasir"
        ]
    },
    email3: {
        id: "email3",
        subject: "Build Your Viral Ad With Us in 24 Hours!",
        body: [
            "Thank you for your purchase and for trusting me.",
            "",
            "We’ll be soon adding you to our Slack workspace, using the email address you provided during checkout.",
            "",
            "If you’d prefer us to use a different email address, simply reply to this email with the one you’d like us to use.",
            "",
            "Your 24 hours will begin once you’ve been added to Slack and we’ve exchanged greetings.",
            "",
            "You’ll be notified of the exact time your 24 hours begin.",
            "",
            "Talk soon,",
            "Yasir"
        ]
    }
};

export function getEmailForTransactionType(transactionType: string): EmailData | null {
    if (!transactionType) return null;

    if (transactionType === "upsell57") {
        return {
            id: emails.email3.id,
            subject: emails.email3.subject,
            html: renderHtml(emails.email3.body)
        };
    } else if (transactionType === "framework_sop") {
        return {
            id: emails.email2.id,
            subject: emails.email2.subject,
            html: renderHtml(emails.email2.body)
        };
    } else if (transactionType === "framework") {
        return {
            id: emails.email1.id,
            subject: emails.email1.subject,
            html: renderHtml(emails.email1.body)
        };
    }

    return null;
}

