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
        // height={"100vh"}
        display={"flex"}
        flexDirection={{ md: "column", xs: "column-reverse" }}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={1}

      >
        <Box width={{ md: "80%", xs: "100%" }}>
          <ProfilePreview />
        </Box>
        <Box width={{ md: "80%", xs: "100%" }}>
          <CalendarPreview deadLines={props.deadLines} focus={props.focus} />
        </Box>
      </Box>
    </>
  );
}
