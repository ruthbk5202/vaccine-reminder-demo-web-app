import * as functions from 'firebase-functions';
import axios from 'axios';



// Replace these with secure environment variables for production
const ONE_SIGNAL_APP_ID = "8d495475-360a-4df3-9927-efb428d23bcb";
const ONE_SIGNAL_API_KEY = "NDkyNGFlMzgtZjYyOC00ZWU0LTkzMzAtZjE2OTI2OGZlZjk3";

export const sendEmailNotification = functions.firestore.document('vaccineReminders/{reminderId}')
) => {
    // Check if data is correctly retrieved
    const reminderData = snap.data() as {
      vaccineName: string;
      reminderDate: string;
    };

    try {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: ONE_SIGNAL_APP_ID,
          included_segments: ['All'],
          email_subject: 'Vaccine Reminder',
          email_body: `Hello, this is a reminder for your upcoming vaccine: ${reminderData.vaccineName} on ${reminderData.reminderDate}.`,
          email_from_name: 'Vaccine Reminder Service',
        },
        {
          headers: {
            Authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Email notification sent:', response.data);
    } catch (error: any) {
      console.error('Error sending email notification:', error.response?.data || error.message);
    }
  });
