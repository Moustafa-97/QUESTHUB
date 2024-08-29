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
      <Container>
        <Box
          width={"100%"}
          minHeight={"100vh"}
          display={"flex"}
          flexDirection={{ md: "row", xs: "column" }}
          alignItems={"start"}
          justifyContent={"center"}
          m={"auto"}
          sx={{
            display: "grid",
            gridTemplateColumns: "60% 40%",
            gridTemplateRows: "auto",
            gridGap: "10px",
          }}
        >
          <Box width={{ md: "100%", xs: "100%" }} height={"100%"} margin={"auto"}> 
            <LeftSection />
          </Box>
          <Box width={{ md: "100%", xs: "100%" }} height={"100%"} margin={"auto"} bgcolor="green">
            <RightSection deadLines={deadLinesArray} focus={[]} />
          </Box>
        </Box>
      </Container>
    </>
  );
}
