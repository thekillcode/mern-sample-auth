import { etherealMailer, mailTrapMailer, SMTPMailer } from '../utils/mailer.js';

export const sendMail = async (mailOptions, mailer) => {
  if (mailer == 'ethereal') {
    const etherealInfo = await etherealMailer.sendMail(mailOptions);
    return etherealInfo;
  }
  if (mailer == 'mailtrap') {
    const mailTrapInfo = await mailTrapMailer.sendMail(mailOptions);
    return mailTrapInfo;
  }
  if (mailer == 'smtp') {
    const smtpInfo = await SMTPMailer.sendMail(mailOptions);
    return smtpInfo;
  }
};
