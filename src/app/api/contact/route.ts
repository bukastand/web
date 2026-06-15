import { NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, recipientEmail, siteName } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Email penerima belum dikonfigurasi" },
        { status: 400 }
      );
    }

    const site = siteName || "Website";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 32px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
          .body { padding: 32px; }
          .field { margin-bottom: 20px; }
          .field-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .field-value { font-size: 16px; color: #1e293b; line-height: 1.5; }
          .divider { height: 1px; background: #e2e8f0; margin: 24px 0; }
          .message-box { background: #f8fafc; border-radius: 12px; padding: 20px; border-left: 4px solid #22c55e; }
          .footer { text-align: center; padding: 24px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Pesan Baru dari ${site}</h1>
            <p>Ada seseorang yang mengirimkan pesan melalui form kontak</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="field-label">Nama</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value"><a href="mailto:${email}" style="color: #22c55e">${email}</a></div>
            </div>
            ${phone ? `
            <div class="field">
              <div class="field-label">No. Telepon</div>
              <div class="field-value">${phone}</div>
            </div>
            ` : ""}
            <div class="divider"></div>
            <div class="field">
              <div class="field-label">Pesan</div>
              <div class="message-box">
                <div class="field-value" style="white-space: pre-wrap">${message}</div>
              </div>
            </div>
          </div>
          <div class="footer">
            Dikirim dari form kontak website &mdash; ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
          </div>
        </div>
      </body>
      </html>
    `;

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: `Contact Form <onboarding@resend.dev>`,
      to: [recipientEmail],
      subject: `📬 Pesan Baru dari ${site} — ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Gagal mengirim email. Silakan coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil dikirim!",
      id: data?.id,
    });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
