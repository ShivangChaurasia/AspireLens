import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"AspireLens" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
    });
 
  } catch (error) {
    console.error("Email error:", error);
  }
};
