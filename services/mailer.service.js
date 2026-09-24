var nodemailer = require('nodemailer');

// If SMTP_HOST is set in .env, emails are sent for real.
// Otherwise we run in dev mode: the reset link is logged to the console.
var transporter = null;
if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: process.env.SMTP_USER ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        } : undefined
    });
}

exports.sendResetPasswordEmail = async function (to, resetUrl) {
    if (!transporter) {
        console.log('[DEV] Link de recuperacion para ' + to + ': ' + resetUrl);
        return { delivered: false };
    }
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: to,
        subject: 'Recuperacion de contraseña',
        text: 'Para restablecer tu contraseña, abri este link (vence en 1 hora): ' + resetUrl
    });
    return { delivered: true };
}
