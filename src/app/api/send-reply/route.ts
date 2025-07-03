import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    const { to, subject, reply, name } = await req.json()

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const signature = `
--
AKNETH Studio
Katarzyna Pawłowska-Malesa
tel: +48 690 973 352
https://akneth-studio.vercel.app
`;

    const intro = `Dzień dobry${name ? `, ${name}` : ''}!`
    const outro = `Pozdrawiam,`

    const textBody = `${intro}\n\n${reply}\n\n${outro}\n${signature}`

    await transporter.sendMail({
        from: `"AKNETH Studio" <${process.env.SMTP_USER}>`,
        to,
        subject: `Odpowiedź: ${subject}`,
        text: textBody,
        replyTo: process.env.NEXT_PUBLIC_EMAIL,
    });

    return NextResponse.json({ success: true })
}
