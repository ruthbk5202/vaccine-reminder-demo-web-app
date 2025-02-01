"use-client";
import { Container, Typography } from "@mui/material";
import { styled } from "@mui/system";

// Styled components for better organization
const InfoSection = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  backgroundColor: "#f9f9f9",
  textAlign: "center",
}));

const ImmunizeSection = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(6),
  "& h1": {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#3f51b5",
    marginBottom: theme.spacing(2),
  },
  "& p": {
    fontSize: "1.1rem",
    color: "#555",
    lineHeight: "1.6",
  },
}));

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(4),
  justifyContent: "center",
}));

const InfoBlock = styled("div")(({ theme }) => ({
  flex: "1 1 45%",
  maxWidth: "600px",
  backgroundColor: "#fff",
  padding: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  "& p": {
    fontSize: "1rem",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: theme.spacing(2),
  },
}));

const Info = () => {
  return (
    <InfoSection>
      <Container maxWidth="lg">
        <ImmunizeSection>
          <Typography variant="h1" component="h1">
            Immunization saves millions of lives
          </Typography>
          <Typography variant="body1" component="p">
            The Vaccine App is an official digital vaccine card replacing all
            paper counterparts globally.
          </Typography>
          <Typography variant="body1" component="p">
            Your personal vaccine record keeper, a digital record which you can
            never lose.
          </Typography>
        </ImmunizeSection>

        <Wrapper>
          <InfoBlock>
            <Typography variant="body1" component="p">
              Remember the old savings bank books we had with handwritten
              entries? Seems archaic right? We all bank using banking apps now.
              So why do we still have handwritten vaccine cards?
            </Typography>
            <Typography variant="body1" component="p">
              Vaccines are given on a schedule and the doses are timed so the
              vaccine can effectively protect patients from preventable
              diseases. Children, pregnant women, over 65 year olds and those
              with comorbidities are amongst the most vulnerable groups.
            </Typography>
            <Typography variant="body1" component="p">
              COVID19 has highlighted how important it is to have accurate
              immunisation records from childhood to end of life.
            </Typography>
          </InfoBlock>

          <InfoBlock>
            <Typography variant="body1" component="p">
              Currently there is no effective solution to accurately record this
              information.
            </Typography>
            <Typography variant="body1" component="p">
              The Vaccine App moves us on to efficiency and convenience making
              all our lives easier.
            </Typography>
            <Typography variant="body1" component="p">
              No more lost cards, parental guilt, missed or catch-up vaccines.
              With built-in reminders, PDF printouts, and geolocation to find
              the nearest clinic.
            </Typography>
            <Typography variant="body1" component="p">
              The Vaccine App is an all-in-one solution.
            </Typography>
          </InfoBlock>
        </Wrapper>
      </Container>
    </InfoSection>
  );
};

export default Info;
