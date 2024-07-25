import RightSection from "./RightSectionUser/RightSection";
import LeftSection from "./LeftSectionUser/LeftSection";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

interface Props {
  tasks: {
    pendingTasks: [
      {
        _id: string;
        taskTitle: string;
        TaskDescription: string;
        startDate: string;
        endDate: string;
        status: string;
        userId: number;
      }
    ];
  };
}

export default function UserHomePage() {
  const tasks = useSelector((state: Props) => state?.tasks?.pendingTasks);
  const deadLinesArray = tasks && tasks.map((task) => task.endDate);

  return (
    <>
      <Box
        width={"100%"}
        minHeight={"100vh"}
        display={"flex"}
        flexDirection={{ md: "row", xs: "column" }}
        alignItems={"start"}
        justifyContent={"center"}
        m={"auto"}
      >
        <Box width={{ md: "55%", xs: "100%" }}>
          <LeftSection />
        </Box>
        <Box width={{ md: "45%", xs: "100%" }}>
          <RightSection deadLines={deadLinesArray} focus={[]} />
        </Box>
      </Box>
    </>
  );
}
