import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

export const etherealMailer = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'jay.wyman@ethereal.email',
    pass: 'PjjPHPzfdcuqzdRZ3R',
  },
});

export const SMTPMailer = nodemailer.createTransport({
  host: 'mail.thekillcode.com',
  port: 465,
  secure: true,
  auth: {
    user: 'pavf@thekillcode.com',
    pass: 'PAVF123!@#',
  },
});
export const mailTrapMailer = nodemailer.createTransport(
  MailtrapTransport({ token: '' })
);
