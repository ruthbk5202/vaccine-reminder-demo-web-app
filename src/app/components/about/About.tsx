"use client";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

const Root = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  marginBottom: theme.spacing(6),
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(6),
  fontWeight: "bold",
  color: "#3f51b5",
  textAlign: "center",
  fontSize: "2.5rem",
  background: "linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const TeamMember = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
  margin: "0 auto",
  marginBottom: theme.spacing(3),
  border: "4px solid #3f51b5",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const AboutUs = () => {
  return (
    <Root>
      <Container maxWidth="lg">
        <SectionTitle variant="h2">Meet Our Team</SectionTitle>

        {/* Using Stack instead of Grid */}
        <Stack
          spacing={6}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
        >
          <TeamMember>
            <StyledAvatar alt="Drisya Giri" src="assets/images/drisya.jpg" />
            <Typography variant="h6" gutterBottom>
              Drisya Giri
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Frontend Developer
            </Typography>
          </TeamMember>

          <TeamMember>
            <StyledAvatar alt="Saurab Katuwal" src="assets/images/saurab.jpg" />
            <Typography variant="h6" gutterBottom>
              Saurab Katuwal
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              UI/UX Designer
            </Typography>
          </TeamMember>

          <TeamMember>
            <StyledAvatar alt="Ruth Bishwakarma" src="assets/images/ruth.jpg" />
            <Typography variant="h6" gutterBottom>
              Ruth Bishwakarma
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Backend Developer
            </Typography>
          </TeamMember>
        </Stack>
      </Container>
    </Root>
  );
};

export default AboutUs;
