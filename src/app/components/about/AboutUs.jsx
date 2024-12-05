"use client";
import "./about.css";

const AboutUs = () => {
  return (
    <div className="container">
      <div className="grid-container">
        <div className="image-svg">
          <img src="assets/svg/aboutus.svg" alt="About Us" />
        </div>
        <div className="content">
          <p>
            Welcome to Vaccine Reminder, your trusted partner in staying on top
            of
            <br />
            your vaccination schedule. Our mission is to simplify healthcare by
            <br />
            ensuring that you and your loved ones never miss a critical vaccine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
