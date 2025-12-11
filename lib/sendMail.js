import nodemailer from 'nodemailer'

export const sendMail = async (subject, receiver, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: Number(process.env.NODEMAILER_PORT) === 465, // true for port 465
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const options = {
    from: `"Developer Shakib" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(options);
    return { success: true };
  } catch (error) {
    console.error("Mail error:", error);
    return { success: false, error: error.message };
  }
};
