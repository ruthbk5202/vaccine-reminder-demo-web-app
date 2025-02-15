"use client";
import { Box, Container, Typography } from "@mui/material";
import VaccineImp from "../components/impvaccine/VaccineImp";
import "./privacy.css";

const PrivacyPolicy = () => {
  return (
    <Box className="full-width">
   
      <Container maxWidth="md" sx={{ py: 6 }} className="full-width-container">
        <Typography
          variant="h3"
          gutterBottom
          align="center"
          sx={{
            fontWeight: "bold",
            mb: 4,
            width: "100%",
            color: "whitesmoke",
            paddingTop: "32px",
          }}
          className="privacy"
        >
          Privacy Policy
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "200px",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            1. Information We Collect
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We collect the following types of information to provide and improve
            our services:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            <strong>Personal Information:</strong> Name, email address, phone
            number, date of birth, health conditions, and vaccine history.
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            <strong>Usage Data:</strong> Device information, IP address, browser
            type, and log data.
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            <strong>Cookies:</strong> We use cookies to enhance your experience
            and analyze usage patterns.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We use your information to:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            - Send vaccine reminders and notifications.
            <br />
            - Personalize vaccine recommendations.
            <br />
            - Respond to your inquiries and provide support.
            <br />- Improve our services and ensure security.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            3. How We Share Your Information
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We do not sell or rent your personal information. We may share your
            information with:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            - Trusted service providers (e.g., email and SMS providers).
            <br />- Legal authorities when required by law.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            4. Data Security
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We implement industry-standard security measures, including
            encryption and access controls, to protect your data.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            5. Your Rights
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            You have the right to:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            - Access, correct, or delete your personal information.
            <br />- Opt out of promotional communications.
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            6. Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            <strong>Email:</strong> [Insert Contact Email]
            <br />
          </Typography>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4, fontWeight: "bold", color: "black" }}
          >
            7. Changes to This Policy
          </Typography>
          <Typography variant="body1" sx={{ color: "black" }}>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated "Last Updated" date.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
