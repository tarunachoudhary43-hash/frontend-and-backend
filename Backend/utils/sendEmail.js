const Brevo = require('@getbrevo/brevo');

module.exports = async function sendEmail(to, subject, resetUrl) {
    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.authentications.apiKey.apiKey =
            process.env.BREVO_API_KEY;

        const email = {
            sender: {
                email: "tarunachoudhary43@gmail.com",
                name: "Auth System"
            },
            to: [{ email: to }],
            subject,

            // ✅ NO <a> TAG — RAW URL ONLY
            htmlContent: `
                <h2>Password Reset</h2>
                <p>You requested to reset your password.</p>

                <p><strong>Copy and paste this link into your browser:</strong></p>

                <p style="word-break: break-all; color: blue;">
                  ${resetUrl}
                </p>

                <p>This link expires in 15 minutes.</p>
                <p>If you did not request this, ignore this email.</p>
            `
        };

        await apiInstance.sendTransacEmail(email);
        return true;

    } catch (err) {
        console.error("Email error:", err);
        return false;
    }
};
