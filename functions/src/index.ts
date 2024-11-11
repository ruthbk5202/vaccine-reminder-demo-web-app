/*import { firestore } from 'firebase-functions/v2';
import * as admin from 'firebase-admin'; // Import firebase-admin to access Firestore types
import axios from 'axios';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Replace with your OneSignal App ID and API Key
const ONE_SIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';
const ONE_SIGNAL_API_KEY = 'YOUR_ONESIGNAL_API_KEY';

export const sendEmailNotification = firestore.document('vaccineReminders/{userId}')
  .onCreate(async (snap: admin.firestore.DocumentSnapshot, context) => {
    // Type the snap parameter explicitly as a Firestore document snapshot
    const reminderData = snap.data() as {
      vaccineName: string;
      reminderDate: string;
    };

    try {
      // Send the email via OneSignal API
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: ONE_SIGNAL_APP_ID,
          included_segments: ['All'], // Modify this to specific segments or users
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
  });*/
