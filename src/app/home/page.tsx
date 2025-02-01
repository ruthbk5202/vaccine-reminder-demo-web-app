"use client";
import Event from "@/app/components/events/Event";
import Footer from "@/app/components/footer/Footer";
import Info from "@/app/components/info/Info";
import NavBar from "@/app/components/navbar/NavBar";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiAppStoreLogoThin, PiGooglePlayLogoThin } from "react-icons/pi";
import AboutUs from "../components/about/About";
import VaccineImp from "../components/impvaccine/VaccineImp";

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

// Keyframes for animations
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

// Styled components using MUI v5 `styled` API
const HeroSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(15, 2),
  background: "linear-gradient(135deg, #3f51b5, #2196f3)",
  color: "#fff",
  textAlign: "center",
  overflow: "hidden",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(8, 2), // Reduce padding on small screens
  },
}));

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
    fontSize: "2rem", // Reduce font size on small screens
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
    padding: theme.spacing(2), // Reduce padding on small screens
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
    padding: theme.spacing(2), // Reduce padding on small screens
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [hasEvents, setHasEvents] = useState(false);
  const [userEvents, setUserEvents] = useState<VaccineReminders[]>([]);
  const [loading, setLoading] = useState(true);
  const [FirstName, setFullName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push("/register");
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = auth.currentUser;

      if (user) {
        setIsRegistered(true);

        try {
          const userDocRef = doc(db, "Users", user.uid);
          await updateDoc(userDocRef, {
            profileCompleted: true,
          });

          const unsubscribeUserProfile = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.profileCompleted) {
                setFullName(userData.FirstName);
                setHasProfile(true);
              } else {
                setHasProfile(false);
              }
            } else {
              setHasProfile(false);
            }
          });

          const eventQuery = query(
            collection(db, "vaccineReminders"),
            where("userId", "==", user.uid)
          );

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
              setHasEvents(true);
            } else {
              setHasEvents(false);
              setUserEvents([]);
            }
          });

          setLoading(false);

          return () => {
            unsubscribe();
            unsubscribeUserProfile();
          };
        } catch (error) {
          console.error("Error fetching user or event data:", error);
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserStatus();
      } else {
        setLoading(false);
      }
    });
  }, [auth, db]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <NavBar
        profilePicture={profileImage}
        firstName={FirstName}
        isRegistered={isRegistered}
        hasProfile={hasProfile}
        hasEvents={hasEvents}
      />

      {!isRegistered ? (
        <HeroSection>
          <Content>
            <Container maxWidth="md">
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  animation: `${fadeIn} 1s ease`,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }} // Responsive font size
              >
                Never Miss a Vaccine Again
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  animation: `${fadeIn} 1.2s ease`,
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }} // Responsive font size
              >
                Stay on top of your vaccination schedule with our easy-to-use
                reminder system.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  mt: 4,
                  animation: `${fadeIn} 1.4s ease`,
                  width: { xs: "100%", sm: "200px" },
                }} // Full width on small screens
                onClick={handleGetStartedClick}
              >
                Get Started
              </Button>
            </Container>
          </Content>
        </HeroSection>
      ) : isRegistered && hasEvents ? (
        <DashboardSection>
          <Container maxWidth="lg">
            <WelcomeMessage>Welcome, {FirstName}!</WelcomeMessage>
          </Container>
        </DashboardSection>
      ) : isRegistered && hasProfile && !hasEvents ? (
        <EventSection>
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                animation: `${fadeIn} 1s ease`,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }} // Responsive font size
            >
              Please add at least one event to access the dashboard.
            </Typography>
            <Event />
          </Container>
        </EventSection>
      ) : isRegistered && !hasProfile ? (
        <EventSection>
          <Container maxWidth="lg">
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                animation: `${fadeIn} 1s ease`,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              }} // Responsive font size
            >
              Please complete your profile to access the dashboard.
            </Typography>
            <Event />
          </Container>
        </EventSection>
      ) : (
        <HeroSection>
          <Content>
            <Container maxWidth="md">
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  animation: `${fadeIn} 1s ease`,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                }} // Responsive font size
              >
                Please log in or register to access the dashboard.
              </Typography>
            </Container>
          </Content>
        </HeroSection>
      )}

      {/* Features Section */}
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
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <Typography variant="h6" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Our platform is designed with simplicity in mind, making it
                  easy for anyone to schedule and manage their vaccine
                  appointments.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <Typography variant="h6" gutterBottom>
                  Reliable Reminders
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Never miss a vaccine appointment again. We send timely
                  reminders via email and notifications.
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard>
                <Typography variant="h6" gutterBottom>
                  Secure & Private
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your data is safe with us. We use industry-standard encryption
                  to protect your personal information.
                </Typography>
              </FeatureCard>
            </Grid>
          </Grid>
        </Container>
      </FeaturesSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TestimonialCard>
                <Typography variant="body1" gutterBottom>
                  "This app has made managing my family's vaccines so much
                  easier! Highly recommend it."
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  - John Doe
                </Typography>
              </TestimonialCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TestimonialCard>
                <Typography variant="body1" gutterBottom>
                  "I never miss a vaccine appointment anymore. The reminders are
                  a lifesaver!"
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  - Jane Smith
                </Typography>
              </TestimonialCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TestimonialCard>
                <Typography variant="body1" gutterBottom>
                  "The app is so easy to use, and I love how secure it feels."
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  - Alice Johnson
                </Typography>
              </TestimonialCard>
            </Grid>
          </Grid>
        </Container>
      </TestimonialsSection>

      {/* CTA Section */}
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
            sx={{ mt: 4, width: { xs: "100%", sm: "200px" } }} // Full width on small screens
            onClick={handleGetStartedClick}
          >
            Sign Up Now
          </Button>
        </Container>
      </CTASection>

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mt: 4,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" }, // Stack icons vertically on small screens
            }}
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
          </Box>
        </Container>
      </DownloadSection>
      <AboutUs />
      <VaccineImp />
      <Info />
      <Footer />
    </Box>
  );
}

export default HomePage;
