import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER } from "@/config";

const getMailerObject = () => {
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT ? Number(MAIL_PORT) : 465,
    secure: true,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });
  return transporter;
};

export const sendEmail = async (
  to: string[],
  subject: string,
  templateName: string,
  replacement?: object,
  attachments?: {
    filename?: string;
    content?: string;
    contentType?: string;
    path?: string;
  }[],
  cc: string[] = [],
  bcc: string[] = []
) => {
  try {
    const filePath = path.join(__dirname, `../templates/${templateName}.ejs`);

    const result = await ejs.renderFile(filePath, replacement);

    const mailOptions = {
      from: MAIL_USER,
      to: to.join(),
      subject,
      cc: cc.join(),
      bcc: bcc.join(),
      html: result,
      attachments,
    };

    const transporter = getMailerObject();
    await transporter.sendMail(mailOptions);

    return "Email sent";
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
