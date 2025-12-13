const Brevo = require('@getbrevo/brevo');

module.exports = async function sendEmail(to, subject, resetUrl) {
    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.authentications['apiKey'].apiKey =
            process.env.BREVO_API_KEY;

        const email = {
            sender: {
                email: "tarunachoudhary43@gmail.com",
                name: "Auth System"
            },
            to: [{ email: to }],
            subject,

            htmlContent: `
                <h2>Password Reset</h2>
                <p>Click the button below to reset your password:</p>

                <a href="${resetUrl}"
                   style="
                     display:inline-block;
                     padding:12px 24px;
                     background:#4CAF50;
                     color:#fff;
                     text-decoration:none;
                     border-radius:6px;
                     font-weight:bold;
                   ">
                   Reset Password
                </a>

                <p>This link expires in 15 minutes.</p>
            `,

            // 🔥 IMPORTANT FIX
            tracking: {
                click: false,
                open: false
            }
        };

        await apiInstance.sendTransacEmail(email);
        return true;

    } catch (err) {
        console.error("Email error:", err);
        return false;
    }
};
