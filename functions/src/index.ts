import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY ; 



export const sendVaccinationReminderEmail = onDocumentCreated('vaccineReminders/{reminderId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.error('No data found in the document.');
    return;
  }

  const vaccineData = snapshot.data();
  const email = vaccineData.email; // Assuming email is part of the document
  const vaccineName = vaccineData.vaccineName; // Assuming vaccine name is part of the document
  const reminderDate = vaccineData.reminderDate; // Assuming reminder date is part of the document

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = 'Vaccination Reminder';
  sendSmtpEmail.htmlContent = `
    <h3>Reminder for Your Vaccine Appointment</h3>
    <p>This is a reminder for your upcoming vaccine appointment:</p>
    <p><strong>Vaccine:</strong> ${vaccineName}</p>
    <p><strong>Reminder Date:</strong> ${reminderDate}</p>
    <p>Stay safe and healthy!</p>
  `;

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
