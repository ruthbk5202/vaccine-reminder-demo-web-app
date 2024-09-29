import React from "react";
import "./info.css";

const Info = () => {
  return (
    <div>
      <div className="info-section">
        <div className="immunize">
        <h1>Immunization saves millions of lives</h1>
        <p>
          The Vaccine App is an official digital vaccine card replacing all
          paper counterparts globally.
        </p>
        <p>
          Your personal vaccine record keeper, a digital record which you can
          never lose.
        </p>
        </div>
        <div className="wrapper">
          <div className="info-section1">
            <p>
              Remember the old savings bank books we had with handwritten
              entries? Seems archaic right? We all bank using banking apps now.
              So why do we still have handwritten vaccine cards?
            </p>

            <p>
              Vaccines are given on a schedule and the doses are timed so the
              vaccine can effectively protect patients from preventable
              diseases. Children, pregnant women, over 65 year olds and those
              with comorbidities are amongst the most vulnerable groups.
            </p>
            <p>
              COVID19 has highlighted how important it is to have accurate
              immunisation records from childhood to end of life.
            </p>
        </div>
          <div className="info-section2">
          <p>
            Currently there is no effective solution to accurately record this
            information.
          </p>
          <p>
            The Vaccine App moves us on to efficiency and convenience making all
            our lives easier.
          </p>
          <p>
            No more lost cards, parental guilt, missed or catch-up vaccines.
            With built in reminders, pdf printouts and geolocation to find the
            nearest clinic. 
            </p>
            <p>
            The Vaccine App is an all in one solution.
          </p>
        </div>
        
        
      </div>
    </div>
    </div>
   
  );
};

export default Info;
