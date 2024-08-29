import { Box } from "@mui/material";
import ProfilePreview from "./profile/ProfilePreview";
import CalendarPreview from "./calendar/CalendarPreview";

interface Props {
  deadLines: string[];
  focus: string[];
}

export default function RightSection(props: Props) {
  return (
    <>
      <Box
        width={{ md: "100%", xs: "100%" }}
        height={"100%"}
        sx={{
          display: "grid",
          gridTemplateRows: "50% 50%",
          gridTemplateColumns: "auto",
          gridTemplateAreas: `"profile"
           "calendar"`,
          gridGap: "2px",
        }}
        // gap={1}
      >
        <Box width={"100%"} height={"100%"} gridArea={"profile"}>
          <ProfilePreview />
        </Box>
        <Box
          width={{ md: "100%", xs: "100%" }}
          height={"100%"}
          gridArea={"calendar"}
        >
          <CalendarPreview deadLines={props.deadLines} focus={props.focus} />
        </Box>
      </Box>
    </>
  );
}
