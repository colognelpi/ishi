const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');

const smtpHost = defineSecret('SMTP_HOST');
const smtpUser = defineSecret('SMTP_USER');
const smtpPass = defineSecret('SMTP_PASS');
const notifyEmail = defineSecret('NOTIFY_EMAIL');

/**
 * Triggers whenever a new response document is created in /responses/{responseId}.
 * Update `database` to match `firestoreDatabaseId` in firebase-applet-config.json if using a named database.
 */
exports.notifyOnConfessionResponse = onDocumentCreated(
  {
    document: 'responses/{responseId}',
    database: 'ai-studio-6d6ca7f7-0e21-47a1-94b9-4df597752d29',
    secrets: [smtpHost, smtpUser, smtpPass, notifyEmail],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const answer = data.answer === 'YES' ? 'YES' : 'NO';
    const invitationId = data.invitationId || event.params.responseId;
    const recipientName = data.recipientName || 'Irish';

    const subject =
      answer === 'YES'
        ? 'Someone just said YES! Your little story might be beginning.'
        : 'Your invitation has received a response.';

    const bodyText =
      answer === 'YES'
        ? `Someone just said YES! Your little story might be beginning.\n\nInvitation ID: ${invitationId}\nRecipient: ${recipientName}\nSelected Answer: YES`
        : `Your invitation has received a response.\n\nInvitation ID: ${invitationId}\nRecipient: ${recipientName}\nSelected Answer: ${answer}`;

    const transporter = nodemailer.createTransport({
      host: smtpHost.value(),
      port: 465,
      secure: true,
      auth: {
        user: smtpUser.value(),
        pass: smtpPass.value(),
      },
    });

    await transporter.sendMail({
      from: `"A Little Something for You" <${smtpUser.value()}>`,
      to: notifyEmail.value(),
      subject,
      text: bodyText,
    });
  }
);
