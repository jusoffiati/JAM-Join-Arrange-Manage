import { useEffect, useMemo } from "react";
import EventMini from "../EventDashboard/EventMini";
import ToggleButton from "../EventDashboard/ToggleButton";
import { useParams } from "react-router-dom";
import { useGetEventQuery } from "../../services/ThesisDB";
import { useAuth } from "../../utils/useAuth";
import { useIsLoggedIn } from "../../utils/useIsLoggedIn";
import LandingPage from "../../pages/LandingPage/LandingPage";

export default function Event() {
  const isLoggedIn = useIsLoggedIn();
  const { eventid } = useParams();
  const { data } = useGetEventQuery(eventid as string);

  return (
    <>
      <div>
        {isLoggedIn ? (
          <>
            <EventMini data={data} />
            <ToggleButton data={data} />
          </>
        ) : (
          <LandingPage data={data} />
        )}
      </div>
    </>
  );
}
