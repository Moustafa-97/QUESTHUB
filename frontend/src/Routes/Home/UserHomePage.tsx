import RightSection from "./RightSectionUser/RightSection";
import LeftSection from "./LeftSectionUser/LeftSection";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import Container from "../../components/style/Container";

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
      {/* <Container> */}
      <Box
        m={"auto"}
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "60% 40%", xs: "100%" },
          gridTemplateRows: "auto",
          gridGap: { md: "10px", xs: "20px" },
        }}
      >
        <Box width={{ md: "100%", xs: "100%" }} height={"100%"} margin={"auto"}>
          <LeftSection />
        </Box>
        <Box width={"100%"} height={"100%"} margin={"auto"} mt={0}>
          <RightSection deadLines={deadLinesArray} focus={[]} />
        </Box>
      </Box>
      {/* </Container> */}
    </>
  );
}
