import Mailgun from "mailgun.js";
import formData from "form-data";
import { mailConfig } from "../../config/config.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: "api",
    key: mailConfig.API_KEY,
});

class MailService {
    static async sendResetPasswordEmail(user, code) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Reset Password",
            text: `Your reset password code is ${code}`,
            html: `<p>Your reset password code is <strong>${code}</strong></p>`,
        });
    }

    static async sendVerificationEmail(user, code) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Verify Account",
            text: `Your verification code is ${code}`,
            html: `<p>Your verification code is <strong>${code}</strong></p>`,
        });
    }

    static async sendPasswordIsChangedEmail(user) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Password Changed",
            text: "Your password has been changed",
            html: "<p>Your password has been changed</p>",
        });
    }
}

export default MailService;
