import nodemailer from 'nodemailer';

// Create transporter using environment variables, with fallback to EMAIL/EMAIL_PASSWORD
export const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = (process.env.SMTP_SECURE === 'true') || false;
  const user = process.env.SMTP_USER || process.env.EMAIL;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    console.warn('Mailer config: SMTP_USER/SMTP_PASS or EMAIL/EMAIL_PASSWORD not set - emails will fail');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  return transporter;
};

export const sendOTPEmail = async (to, otp) => {
  const transporter = createTransporter();

  const from = process.env.SMTP_FROM || (process.env.EMAIL ? `Krishisetu <${process.env.EMAIL}>` : undefined);

  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Verify your Krishisetu account',
    text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`
  });

  return info;
};
