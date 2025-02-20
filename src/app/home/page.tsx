"use client";
import Footer from "@/app/components/footer/Footer";
import Info from "@/app/components/info/Info";
import NavBar from "@/app/components/navbar/NavBar";
import { VolumeOff, VolumeUp } from "@mui/icons-material"; // Import volume icons
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiAppStoreLogoThin, PiGooglePlayLogoThin } from "react-icons/pi";
import ReactPlayer from "react-player";
// import AboutUs from "../components/about/About";
import VaccineImp from "../components/impvaccine/VaccineImp";

import "./home.css";

interface VaccineReminders {
  id?: string;
  vaccineName: string;
  vaccineType: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  preferredDate: string;
  reminderDate: string;
  healthConditions?: string;
  notes?: string;
  userId: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(15, 2),
  background: "linear-gradient(135deg, #3f51b5, #2196f3)",
  color: "#fff",
  textAlign: "center",
  overflow: "hidden",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(8, 2),
  },
}));

const VideoSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#f9f9f9",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
}));

const VideoContainer = styled("div")({
  position: "relative",
  paddingTop: "56.25%", // 16:9 aspect ratio
  borderRadius: "12px",
  overflow: "hidden",
  margin: "0 auto",
  maxWidth: "800px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
});

const MuteButton = styled(IconButton)({
  position: "absolute",
  bottom: "16px",
  right: "16px",
  zIndex: 2,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

const Content = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 1,
}));

const DashboardSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#f9f9f9",
}));

const EventSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#ffffff",
}));

const WelcomeMessage = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#3f51b5",
  textAlign: "center",
  marginBottom: theme.spacing(4),
  animation: `${fadeIn} 1s ease`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  margin: "20px auto",
  display: "block",
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const FeaturesSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#ffffff",
}));

const TestimonialsSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#f9f9f9",
}));

const TestimonialCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const CTASection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#3f51b5",
  color: "#fff",
  textAlign: "center",
}));

const FAQSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#ffffff",
}));

const DownloadSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#3f51b5",
  color: "#fff",
  textAlign: "center",
}));

function HomePage() {
  const [userEvents, setUserEvents] = useState<VaccineReminders[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const [isRegistered, setIsRegistered] = useState(false);
  const [parsedUserNull, setParsedUser] = useState<AppUser | null>(null);

  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push("/register");
  };

  const handleDashboardClick = () => {
    router.push("/dash"); // Navigate to the dashboard
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev); // Toggle mute state
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const userString = localStorage.getItem("user");

      if (userString != null) {
        if (userString) {
          try {
            const parsedUser = JSON.parse(userString) as AppUser;
            setParsedUser(parsedUser);
            console.log("Valid user:", parsedUser.email);
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }

        try {
          const eventQuery = query(collection(db, "vaccineReminders"));

          const unsubscribe = onSnapshot(eventQuery, (snapshot) => {
            if (!snapshot.empty) {
              const events = snapshot.docs
                .map((doc) => {
                  const eventData = doc.data();
                  if (
                    eventData &&
                    eventData.userId &&
                    eventData.vaccineName &&
                    eventData.vaccineType
                  ) {
                    return {
                      id: doc.id,
                      ...eventData,
                    } as VaccineReminders;
                  } else {
                    console.warn(
                      `Document with ID ${doc.id} has incomplete data:`,
                      eventData
                    );
                    return null;
                  }
                })
                .filter((event): event is VaccineReminders => event !== null);

              console.log("Fetched events:", events);

              setUserEvents(events);
            } else {
              setUserEvents([]);
            }
          });

          setLoading(false);

          return () => {
            unsubscribe();
          };
        } catch (error) {
          console.error("Error fetching user or event data:", error);
        }
      } else {
        setIsRegistered(false); // User is not registered/logged in
        setLoading(false);
      }
    };

    onAuthStateChanged(auth, (user) => {
      checkUserStatus();
    });
  }, [auth, db]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <NavBar
        profilePicture={profileImage}
        firstName={firstName}
        isRegistered={isRegistered}
      />

      <HeroSection>
        <Content>
          <Container maxWidth="md">
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                animation: `${fadeIn} 1s ease`,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              Never Miss a Vaccine Again
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                animation: `${fadeIn} 1.2s ease`,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Stay on top of your vaccination schedule with our easy-to-use
              reminder system.
            </Typography>
            {!parsedUserNull ? (
              // Show Get Started button if user is not registered
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  mt: 4,
                  animation: `${fadeIn} 1.4s ease`,
                  width: { xs: "100%", sm: "200px" },
                }}
                onClick={handleGetStartedClick}
              >
                Get Started
              </Button>
            ) : (
              // Show Dashboard button if user is registered
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  mt: 4,
                  animation: `${fadeIn} 1.4s ease`,
                  width: { xs: "100%", sm: "200px" },
                }}
                onClick={handleDashboardClick}
              >
                Go to Dashboard
              </Button>
            )}
          </Container>
        </Content>
      </HeroSection>

      {/* Video Section */}
      <VideoSection>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              mb: 4,
            }}
          >
            Watch This Video to Learn More
          </Typography>
          <VideoContainer>
            <ReactPlayer
              url="https://youtu.be/9_nyG2TUDcQ?si=cl1OVgGeE6guOyZh"
              width="100%"
              height="100%"
              playing={true}
              muted={isMuted} // Controlled by isMuted state
              loop={true}
              controls={false}
              config={{
                youtube: {
                  playerVars: { modestbranding: 1, controls: 0 },
                },
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <MuteButton onClick={toggleMute} aria-label="mute/unmute">
              {isMuted ? <VolumeOff /> : <VolumeUp />}
            </MuteButton>
          </VideoContainer>
        </Container>
      </VideoSection>
      <VaccineImp />
      <FeaturesSection>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
          >
            Why Choose Us?
          </Typography>
          <Stack
            direction="row"
            spacing={4}
            sx={{ mt: 4 }}
            justifyContent="center"
          >
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                Easy to Use
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Our platform is designed with simplicity in mind, making it easy
                for anyone to schedule and manage their vaccine appointments.
              </Typography>
            </FeatureCard>
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                Reliable Reminders
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Never miss a vaccine appointment again. We send timely reminders
                via email and notifications.
              </Typography>
            </FeatureCard>
            <FeatureCard>
              <Typography variant="h6" gutterBottom>
                Secure & Private
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your data is safe with us. We use industry-standard encryption
                to protect your personal information.
              </Typography>
            </FeatureCard>
          </Stack>
        </Container>
      </FeaturesSection>

      {/* Show "Ready to Get Started" section only if user is not registered */}
      {!parsedUserNull && (
        <CTASection>
          <Container maxWidth="md">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
            >
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" gutterBottom>
              Join thousands of users who are managing their vaccines with ease.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mt: 4, width: { xs: "100%", sm: "200px" } }}
              onClick={handleGetStartedClick}
            >
              Sign Up Now
            </Button>
          </Container>
        </CTASection>
      )}

      {/* FAQ Section */}
      <FAQSection>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Q: How do I add a vaccine reminder?
            </Typography>
            <Typography variant="body1" gutterBottom>
              A: You can add a vaccine reminder by navigating to the "Events"
              section and filling out the form.
            </Typography>
            <Typography variant="h6" gutterBottom>
              Q: Is my data secure?
            </Typography>
            <Typography variant="body1" gutterBottom>
              A: Yes, we use industry-standard encryption to protect your data.
            </Typography>
          </Box>
        </Container>
      </FAQSection>

      {/* Download Section */}
      <DownloadSection>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
          >
            Download Our App
          </Typography>
          <Typography variant="h6" gutterBottom>
            Available on the App Store and Google Play.
          </Typography>
          <Stack
            direction="row"
            spacing={4}
            sx={{ mt: 4 }}
            justifyContent="center"
            alignItems="center"
          >
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box sx={{ textAlign: "center" }}>
                <PiAppStoreLogoThin
                  style={{ fontSize: "3rem", color: "#fff" }}
                />
                <Typography variant="body1" sx={{ color: "#fff", mt: 1 }}>
                  App Store
                </Typography>
              </Box>
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box sx={{ textAlign: "center" }}>
                <PiGooglePlayLogoThin
                  style={{ fontSize: "3rem", color: "#fff" }}
                />
                <Typography variant="body1" sx={{ color: "#fff", mt: 1 }}>
                  Google Play
                </Typography>
              </Box>
            </a>
          </Stack>
        </Container>
      </DownloadSection>
      {/* <AboutUs /> */}
      <Info />
      <Footer />
    </Box>
  );
}

export default HomePage;
