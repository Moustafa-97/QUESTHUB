import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import RightSection from "../Home/RightSectionUser/RightSection";
import SingleTask from "./singleTask/SingleTask";

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
interface Task {
  _id: string;
  taskTitle: string;
  TaskDescription: string;
  startDate: string;
  endDate: string;
  status: string;
  userId: number;
}

export default function TasksManager() {
  const { taskId } = useParams();

  const tasks = useSelector((state: Props) => state.tasks.pendingTasks).filter(
    (task: Task) => task._id === taskId
  );

  return (
    <>
      <Box
        width={"100%"}
        height={"100%"}
        display={"flex"}
        flexDirection={{ md: "row", xs: "column" }}
        alignItems={"start"}
        justifyContent={"center"}
        m={"auto"}
      >
        <Box width={{ md: "55%", xs: "100%" }}>
          <SingleTask task={tasks} />
        </Box>
        <Box width={{ md: "45%", xs: "100%" }}>
          <RightSection deadLines={tasks.map((task: Task) => task.endDate)} focus={tasks.map((task: Task) => task.endDate)} />
        </Box>
      </Box>
    </>
  );
}
