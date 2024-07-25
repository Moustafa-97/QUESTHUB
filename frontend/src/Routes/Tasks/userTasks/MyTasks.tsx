import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import TaskCard from "../../../components/TasksCard/TaskCard";

interface Props {
  tasks: {
    pendingTasks: [
      {
        _id: string;
        taskTitle: string;
        taskDescription: string;
        startDate: string;
        endDate: string;
        taskStatus: string;
      }
    ];
    completedTasks: [
      {
        _id: string;
        taskTitle: string;
        taskDescription: string;
        startDate: string;
        endDate: string;
        taskStatus: string;
      }
    ];
    incompletedTasks: [
      {
        _id: string;
        taskTitle: string;
        taskDescription: string;
        startDate: string;
        endDate: string;
        taskStatus: string;
      }
    ];
  };
}

export default function MyTasks() {
  //
  // selectors
  // -----------
  const pendingTasks = useSelector(
    (state: Props) => state?.tasks?.pendingTasks
  );
  const completedTasks = useSelector(
    (state: Props) => state?.tasks?.completedTasks
  );
  const incompletedTasks = useSelector(
    (state: Props) => state?.tasks?.incompletedTasks
  );

  return (
    <>
      <Box width={"100%"} m={"auto"} textAlign={"center"}>
        <Box mb={4}>
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 2 }}
            fontSize={{ md: 25, xs: 15 }}
          >
            Pending Tasks
          </Typography>
          <TaskCard tasks={pendingTasks} />
        </Box>
        <Box mb={4}>
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 2 }}
            fontSize={{ md: 25, xs: 15 }}
          >
            Completed Tasks
          </Typography>
          <TaskCard tasks={completedTasks} />
        </Box>
        <Box mb={4}>
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 2 }}
            fontSize={{ md: 25, xs: 15 }}
          >
            Incompleted Tasks
          </Typography>
          <TaskCard tasks={incompletedTasks} />
        </Box>
      </Box>
    </>
  );
}
