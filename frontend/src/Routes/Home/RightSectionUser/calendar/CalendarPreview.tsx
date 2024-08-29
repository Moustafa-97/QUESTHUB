import { Box, CardContent, Card } from "@mui/material";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import "react-calendar/dist/Calendar.css";
import Badge from "@mui/material/Badge";
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers";
import { DoneAll } from "@mui/icons-material";

interface Props {
  deadLines: string[];
  focus: string[];
}

export default function CalendarPreview(props: Props) {
  // convert date for deadline on calendar
  const formattedDates =
    props.deadLines &&
    props.deadLines.map((date) => {
      const dt = new Date(date);
      return `${dt.getFullYear()}-${padZero(dt.getMonth() + 1)}-${padZero(
        dt.getDate()
      )}`;
    });

  // convert date on calendar
  const formattedDate = (e: any) => {
    return `${e.getFullYear()}-${padZero(e.getMonth() + 1)}-${padZero(
      e.getDate()
    )}`;
  };

  function padZero(num: number) {
    return (num < 10 ? "0" : "") + num;
  }

  const ServerDay: any = (props: any) => {
    const { formattedDates = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !outsideCurrentMonth && formattedDates.includes(day.format("YYYY-MM-DD"));

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? <DoneAll /> : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  };

  const [value, setValue] = useState("");
  console.log(value);

  const today =
    props.focus.length === 1 ? dayjs(props.focus.toString()) : dayjs();

  // calendar
  const card = (
    <Box
      width={"100%"}
      height={"100%"}
      sx={{
        display: "flex",
        flexDirection: "column",
        m: "auto",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          m: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={today}
            sx={{ width: "100%" }}
            renderLoading={() => <DayCalendarSkeleton sx={{ width: "100%" }} />}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                formattedDates,
              } as any,
            }}
            onChange={(e) => {
              setValue(formattedDate(e.$d));
            }}
          />
        </LocalizationProvider>
      </CardContent>
    </Box>
  );

  return (
    <Box>
      <Card
        sx={{
          borderRadius: "20px",
          mt: "10px",
          width: "100%",
          boxShadow: "0px 5px 20px",
        }}
        variant="outlined"
      >
        {card}
      </Card>
    </Box>
  );
}
