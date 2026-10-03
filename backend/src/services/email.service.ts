import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.EMAIL_FROM ||
  "DevPilot AI <onboarding@resend.dev>";

const getFirstName = (name: string): string => {
  return name.trim().split(/\s+/)[0] || "there";
};

// ============================================================
// SEND EMAIL
// ============================================================

const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "RESEND_API_KEY is not configured on the backend."
    );
  }

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (result.error) {
    console.error("Resend Email Error:", result.error);
    throw new Error(
      result.error.message || "Failed to send email."
    );
  }

  console.log(
    `📧 Email sent successfully to ${to}`
  );

  return result.data;
};

// ============================================================
// WELCOME EMAIL
// ============================================================

export const sendWelcomeEmail = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const firstName = getFirstName(name);

  return sendEmail({
    to: email,
    subject: "Welcome to DevPilot AI 🚀",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Welcome to DevPilot AI</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background: #0b1120;
          font-family: Arial, Helvetica, sans-serif;
          color: #e5e7eb;
        ">
          <div style="
            max-width: 650px;
            margin: 0 auto;
            padding: 40px 20px;
          ">

            <div style="
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 16px;
              padding: 40px;
            ">

              <h1 style="
                margin: 0 0 12px;
                color: #22d3ee;
                font-size: 30px;
              ">
                Welcome to DevPilot AI 🚀
              </h1>

              <p style="
                font-size: 17px;
                line-height: 1.7;
                color: #d1d5db;
              ">
                Hi ${firstName},
              </p>

              <p style="
                font-size: 16px;
                line-height: 1.7;
                color: #d1d5db;
              ">
                Welcome to <strong>DevPilot AI</strong> — your
                AI-powered software engineering platform.
              </p>

              <p style="
                font-size: 16px;
                line-height: 1.7;
                color: #d1d5db;
              ">
                DevPilot AI helps developers plan, build, debug,
                test and document software using specialized
                AI agents.
              </p>

              <h2 style="
                color: #f9fafb;
                font-size: 20px;
                margin-top: 30px;
              ">
                What you can do with DevPilot AI
              </h2>

              <ul style="
                color: #d1d5db;
                line-height: 2;
                padding-left: 22px;
              ">
                <li>🏗️ AI-powered project architecture</li>
                <li>💻 Intelligent software development</li>
                <li>🎨 UI/UX assistance</li>
                <li>🐛 AI-powered debugging</li>
                <li>🧪 Automated testing assistance</li>
                <li>📚 Technical documentation generation</li>
                <li>🤖 Multi-agent software engineering workflows</li>
                <li>🔗 GitHub project integration</li>
              </ul>

              <div style="
                margin-top: 30px;
                padding: 20px;
                background: #0f172a;
                border-radius: 12px;
                border: 1px solid #164e63;
              ">
                <p style="
                  margin: 0;
                  color: #a5f3fc;
                  line-height: 1.7;
                ">
                  Your account has been successfully created.
                  You can now start building smarter with
                  DevPilot AI.
                </p>
              </div>

              <p style="
                margin-top: 35px;
                color: #9ca3af;
                line-height: 1.6;
              ">
                Happy building! 🚀
              </p>

              <p style="
                margin: 0;
                color: #e5e7eb;
                font-weight: bold;
              ">
                Team DevPilot AI
              </p>

            </div>

            <p style="
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              margin-top: 20px;
            ">
              © ${new Date().getFullYear()} DevPilot AI
            </p>

          </div>
        </body>
      </html>
    `,
  });
};

// ============================================================
// LOGIN OTP EMAIL
// ============================================================

export const sendLoginOTPEmail = async ({
  name,
  email,
  otp,
  expiresInSeconds,
}: {
  name: string;
  email: string;
  otp: string;
  expiresInSeconds: number;
}) => {
  const firstName = getFirstName(name);

  return sendEmail({
    to: email,
    subject: "Your DevPilot AI Login OTP",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>DevPilot AI Login OTP</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background: #0b1120;
          font-family: Arial, Helvetica, sans-serif;
          color: #e5e7eb;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          ">

            <div style="
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            ">

              <h1 style="
                color: #22d3ee;
                margin-top: 0;
              ">
                DevPilot AI
              </h1>

              <p style="
                color: #d1d5db;
                font-size: 16px;
              ">
                Hi ${firstName}, use the OTP below to continue
                logging in to your DevPilot AI account.
              </p>

              <div style="
                margin: 30px 0;
                padding: 22px;
                background: #0f172a;
                border: 1px solid #155e75;
                border-radius: 12px;
              ">
                <div style="
                  font-size: 36px;
                  letter-spacing: 10px;
                  font-weight: bold;
                  color: #22d3ee;
                ">
                  ${otp}
                </div>
              </div>

              <p style="
                color: #fbbf24;
                font-weight: bold;
              ">
                This OTP expires in ${expiresInSeconds} seconds.
              </p>

              <p style="
                color: #9ca3af;
                font-size: 13px;
                line-height: 1.6;
              ">
                If you did not attempt to log in to DevPilot AI,
                you can safely ignore this email.
              </p>

              <p style="
                margin-top: 30px;
                color: #e5e7eb;
                font-weight: bold;
              ">
                Team DevPilot AI
              </p>

            </div>

          </div>
        </body>
      </html>
    `,
  });
};

// ============================================================
// PASSWORD RESET OTP EMAIL
// ============================================================

export const sendPasswordResetOTPEmail = async ({
  name,
  email,
  otp,
  expiresInSeconds,
}: {
  name: string;
  email: string;
  otp: string;
  expiresInSeconds: number;
}) => {
  const firstName = getFirstName(name);

  return sendEmail({
    to: email,
    subject: "DevPilot AI Password Reset OTP",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Password Reset</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background: #0b1120;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          ">

            <div style="
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            ">

              <h1 style="
                color: #22d3ee;
                margin-top: 0;
              ">
                Password Reset
              </h1>

              <p style="
                color: #d1d5db;
                font-size: 16px;
                line-height: 1.6;
              ">
                Hi ${firstName}, we received a request to reset
                your DevPilot AI password.
              </p>

              <div style="
                margin: 30px 0;
                padding: 22px;
                background: #0f172a;
                border: 1px solid #155e75;
                border-radius: 12px;
              ">
                <div style="
                  font-size: 36px;
                  letter-spacing: 10px;
                  font-weight: bold;
                  color: #22d3ee;
                ">
                  ${otp}
                </div>
              </div>

              <p style="
                color: #fbbf24;
                font-weight: bold;
              ">
                This OTP expires in ${expiresInSeconds} seconds.
              </p>

              <p style="
                color: #9ca3af;
                font-size: 13px;
                line-height: 1.6;
              ">
                If you did not request a password reset, please
                ignore this email and keep your current password.
              </p>

              <p style="
                margin-top: 30px;
                color: #e5e7eb;
                font-weight: bold;
              ">
                Team DevPilot AI
              </p>

            </div>

          </div>
        </body>
      </html>
    `,
  });
};