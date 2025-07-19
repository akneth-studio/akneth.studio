import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
    const { to, subject, reply, name } = await req.json()

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
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

    const htmlBody = `
  <div style="font-family:sans-serif; color:#222; font-size:1em;">
    <p>${intro}</p>
    <p>${reply.replace(/\n/g, '<br>')}</p>
    <p>${outro}<br>
    <b>AKNETH Studio</b><br>
    Katarzyna Pawłowska-Malesa<br>
    tel: +48 690 973 352<br>
    <a href="https://akneth-studio.vercel.app">https://akneth-studio.vercel.app</a>
    </p>
  </div>
`;

    try {
        await transporter.sendMail({
            from: `"AKNETH Studio" <${process.env.SMTP_USER}>`,
            to,
            subject: `Odpowiedź: ${subject}`,
            text: textBody,
            html: htmlBody,
            replyTo: process.env.SMTP_USER,
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Błąd wysyłki maila:', error);
        return NextResponse.json({ success: false, error: 'Błąd wysyłki maila.' }, { status: 500 });
    }
}
