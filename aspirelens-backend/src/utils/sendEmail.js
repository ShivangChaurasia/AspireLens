export const sendEmail = async (to, subject, text) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email failed:", errorText);
    }

  } catch (error) {
    console.error("Resend email error:", error.message);
  }
};
