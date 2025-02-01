"use client";
import { Box, Container, Typography } from "@mui/material";
import "./terms.css"; // Import your CSS file for styling

const TermsOfService = () => {
  return (
    <Box className="full-width">
      {/* Terms of Service Content */}
      <Container maxWidth="md" sx={{ py: 6 }} className="full-width-container">
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", mb: 4, paddingTop: "32px" }}
          className="terms-title"
        >
          Terms of Service
        </Typography>

        <Box sx={{ paddingLeft: "200px" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            By accessing or using the Vaccine Reminder System (the "Service"),
            you agree to be bound by these Terms of Service ("Terms"). If you do
            not agree to these Terms, you may not use the Service.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            2. Description of Service
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            The Vaccine Reminder System is designed to help users manage their
            vaccination schedules by sending reminders and notifications about
            upcoming vaccines. The Service is provided for informational
            purposes only and does not replace professional medical advice.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            3. User Responsibilities
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            You agree to:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            - Provide accurate and complete information when using the Service.
            <br />
            - Use the Service only for lawful purposes.
            <br />- Notify us immediately of any unauthorized use of your
            account.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            4. Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy" style={{ color: "#3f51b5" }}>
              Privacy Policy
            </a>
            , which explains how we collect, use, and protect your information.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            5. Limitation of Liability
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            The Service is provided "as is" without any warranties, express or
            implied. We are not responsible for any damages arising from your
            use of the Service, including but not limited to:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            - Missed vaccine appointments.
            <br />
            - Errors or inaccuracies in the information provided.
            <br />- Interruptions or delays in the Service.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            6. Changes to Terms
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We reserve the right to modify these Terms at any time. Any changes
            will be posted on this page with an updated "Last Updated" date.
            Your continued use of the Service after changes are made constitutes
            your acceptance of the revised Terms.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            7. Governing Law
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            These Terms are governed by the laws of [Insert Jurisdiction]. Any
            disputes arising from these Terms will be resolved in the courts of
            [Insert Jurisdiction].
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold" }}
          >
            8. Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            If you have any questions or concerns about these Terms, please
            contact us at:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            <strong>Email:</strong> [vaccineReminder8@gmail.com]
            <br />
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfService;
