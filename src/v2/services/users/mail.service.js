import Mailgun from "mailgun.js";
import formData from "form-data";
import { mailConfig } from "../../config/config.js";
import { reset } from "cls-hooked";

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
            html: getHtmlTemplate("resetPassword", code),
        });
    }

    static async sendVerificationEmail(user, code) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Verify Account",
            text: `Your verification code is ${code}`,
            html: getHtmlTemplate("verification", code),
        });
    }

    static async sendPasswordIsChangedEmail(user) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Password Changed",
            text: "Your password has been changed",
            html: getHtmlTemplate("passwordChanged"),
        });
    }

    static async sendOrderConfirmationEmail(user, order) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Order Confirmation",
            text: `Your order with ID ${order.orderID} has been confirmed`,
            html: getHtmlTemplate("orderConfirmation", order),
        });
    }

    static async sendOrderFailedEmail(user, order) {
        await mg.messages.create(mailConfig.DOMAIN, {
            from: `${mailConfig.NAME} <${mailConfig.USERNAME}@${mailConfig.DOMAIN}>`,
            // to: [user.email],
            to: [mailConfig.TO_TEST],
            subject: "Order Failed",
            text: `Your order with ID ${order.orderID} has failed`,
            html: getHtmlTemplate("orderFailed", order),
        });
    }
}

function getHtmlTemplate(type, data) {
    const templates = {
        resetPassword: (code) => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Reset Your Password</h1>
            <p>You have requested to reset your password. Please use the following code to complete the process:</p>
            <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; font-weight: bold;">
                ${code}
            </div>
            <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
        </div>
        `,

        verification: (code) => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Verify Your Account</h1>
            <p>Thank you for creating an account. To complete the verification process, please use the following code:</p>
            <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 24px; font-weight: bold;">
                ${code}
            </div>
            <p>If you didn't create an account, please ignore this email.</p>
        </div>
        `,

        passwordChanged: () => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Your Password Has Been Changed</h1>
            <p>This email is to notify you that your password has been successfully changed.</p>
            <p style="font-weight: bold;">If you did not make this change, please contact our support team immediately.</p>
            <p>Contact: <a href="mailto:support@example.com">support@example.com</a></p>
        </div>
        `,

        orderConfirmation: (order) => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Order Confirmation</h1>
            <p>Thank you for your order. We're pleased to confirm that it has been received and is being processed.</p>
            <p>Your order ID is: <strong>${order.orderID}</strong></p>
            <p>You can use this order ID to track your order or if you need to contact our support team.</p>
        </div>
        `,

        orderFailed: (order) => `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Order Cancellation Notification</h1>
            <p>We regret to inform you that your order has been cancelled.</p>
            <p>Cancelled Order ID: <strong>${order.orderID}</strong></p>
            <p>If you have any questions about this cancellation or would like to place a new order, please don't hesitate to contact our customer support team.</p>
        </div>
        `,
    };

    return templates[type](data);
}

export default MailService;
