import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "AspireLens <onboarding@resend.dev>",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw error;
  }
};
