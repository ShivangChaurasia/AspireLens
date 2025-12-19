export const sendEmail = async (to, subject, text) => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AspireLens <onboarding@resend.dev>",
        to,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend email failed:", error);
    }

  } catch (err) {
    console.error("Resend email error:", err.message);
  }
};
