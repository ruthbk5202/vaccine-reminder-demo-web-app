"use client";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {
  Box,
  Button,
  Container,
  IconButton,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";

// Styled components using MUI v5 `styled` API
const FooterContainer = styled("footer")(({ theme }) => ({
  color: "#333", // Dark text for better readability
  padding: theme.spacing(6, 2), // Adjusted padding
  marginTop: theme.spacing(8), // Adjusted margin-top
  backgroundColor: "#f9f9f9", // Light background for a clean look
  borderTop: "1px solid #e0e0e0", // Subtle border at the top
}));

const NewsletterForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  maxWidth: "400px",
  margin: "0 auto",
}));

const FooterLink = styled(MuiLink)(({ theme }) => ({
  color: "#3f51b5", // Primary color for links
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateEmail(email)) {
      setMessage(`Thank you for subscribing, ${name}!`);
      setName("");
      setEmail("");
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        {/* Main Content in Flex Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
            gap: 4,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* About Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>
              Vaccine Reminder
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              The Vaccine App is an official digital vaccine card replacing all
              paper counterparts globally. Your personal digital vaccine record
              which you can never lose. From birth to adulthood.
            </Typography>
          </Box>

          {/* Contact and Social Media Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>
              CONTACT US
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
              Have questions? Reach out to us!
            </Typography>
            <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
              Phone:{" "}
              <FooterLink href="tel:+977 9826357274">
                +977 9826357274
              </FooterLink>
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton
                aria-label="Facebook"
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon sx={{ color: "#3f51b5" }} />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon sx={{ color: "#3f51b5" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Newsletter Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ color: "#3f51b5" }}>
              NEWSLETTER
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: "#555" }}>
              Subscribe to our newsletter for the latest updates.
            </Typography>
            <NewsletterForm onSubmit={handleSubmit}>
              <TextField
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Name"
                required
                variant="outlined"
                fullWidth
                size="small"
                sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
              />
              <TextField
                type="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                variant="outlined"
                fullWidth
                size="small"
                sx={{ backgroundColor: "#fff", borderRadius: "4px" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              >
                Subscribe
              </Button>
            </NewsletterForm>
            {message && (
              <Typography variant="body2" sx={{ mt: 1, color: "#ff9800" }}>
                {message}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Footer Links */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            mt: 4,
            pt: 4,
            textAlign: "center",
          }}
        >
          <FooterLink href="/privacy" sx={{ mx: 2 }}>
            Privacy Policy
          </FooterLink>
          <FooterLink href="/terms" sx={{ mx: 2 }}>
            Terms of Service
          </FooterLink>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
