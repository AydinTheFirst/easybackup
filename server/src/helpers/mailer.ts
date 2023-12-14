import nodemailer from "nodemailer";
import { IUser } from "./schemas/user.js";

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.resend.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "resend",
    pass: process.env.mailerKey,
  },
});

transporter.verify((error: any, success: boolean) => {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP server is ready!");
  }
});

const createSender = (name: string, email: string) => {
  return `"${name}" ${email}`;
};

const from = createSender("Fristroop Development", "info@fristroop.com");

export const mailer = {
  sendVerification: async (user: IUser, verificationURL: string) => {
    const mail = transporter.sendMail({
      to: user.email,
      subject: "Please verify your email!",
      text: `Hey ${user.username}!\n\nThank you for signing up. We need you to verify your email. Please click on the following link to verify your email:\n\n${verificationURL}`,
    });

    return sendMail(mail);
  },

  sendResetPsw: async (user: IUser, verificationCode: string) => {
    const mail = transporter.sendMail({
      to: user.email,
      subject: "Your verification code!",
      text: `Hey ${user.username}!\n\nYou requested a verification code for password reset.Here is your code please do not share it!\n\n**${verificationCode}**`,
    });

    return sendMail(mail);
  },
};

const sendMail = async (mail: any) => {
  mail.from = from;
  try {
    await transporter.sendMail(mail);

    return {
      ok: true,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      error: error,
    };
  }
};
