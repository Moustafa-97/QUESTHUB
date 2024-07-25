import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RouteLayout from "../../../layout/RouteLayout";
import { MdStart } from "react-icons/md";
import ButtonComp from "../../../components/Buttons/ButtonComp";
import { NavigateFunction, useNavigate } from "react-router-dom";

export default function TopSection() {
  const initialVisitTime: any = localStorage?.getItem("initialVisitTime");
  if (!initialVisitTime) {
    const initialVisitTime: any = new Date().getTime();
    localStorage.setItem("initialVisitTime", initialVisitTime);
  }
  // get initial time
  const [nowDate, setNowDate] = useState<any>(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowDate(new Date().getTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [nowDate]);
  // calculate time differance
  const timeDifference = nowDate - initialVisitTime;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  // Clear the initialVisitTime
  window.onunload = () => {
    localStorage.removeItem("initialVisitTime");
  };
  const navigate: NavigateFunction = useNavigate();

  return (
    <>
      <RouteLayout>
        <Box
          width={"100%"}
          height={"100%"}
          m={"auto"}
          p={2}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={{ md: "row", xs: "column" }}
          gap={2}
          bgcolor={"white"}
        >
          {/* inspitation quote */}
          {/* button just if not logged in */}
          <Box
            width={{ md: "50%", xs: "100%" }}
            height={"100%"}
            m={"auto"}
            p={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            flexGrow={1}
            gap={3}
          >
            <Typography
              variant="body1"
              component={"span"}
              color={"text.secondary"}
              fontWeight={900}
              letterSpacing={0.7}
              fontSize={{ md: 70, xs: 25 }}
              fontFamily={'"Playwrite ES", cursive'}
            >
              Present isn't now, NOW IS FUTURE
            </Typography>
            {/* get started button */}
            <ButtonComp
              icon={<MdStart />}
              xsFont={15}
              mdFont={25}
              content="GET STARTED"
              onClick={() => navigate("/login")}
            />
          </Box>
          {/* end inspiration and login section */}
          {/* start date, time, Weather section  */}
          <Box
            width={{ md: "50%", xs: "100%" }}
            height={"100%"}
            m={"auto"}
            p={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            flexGrow={1}
            gap={2}
            component={"span"}
            color={"text.secondary"}
            fontWeight={200}
            letterSpacing={0.7}
            fontSize={{ md: 45, xs: 15 }}
            fontFamily={'"Playwrite ES", cursive'}
          >
            <div>
              You have been here for {hours % 24} hours, {minutes % 60} minutes,
              and {seconds % 60} seconds, what are you waiting for !!!
            </div>
          </Box>
        </Box>
      </RouteLayout>
    </>
  );
}
