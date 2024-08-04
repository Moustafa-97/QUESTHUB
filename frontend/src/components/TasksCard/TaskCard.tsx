import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  userCompletedTasks,
  userIncomletedTasks,
  userTasks,
} from "../../Redux/Tools/HandleUserTasks";

interface Props {
  tasks: [
    {
      _id: string;
      taskTitle: string;
      taskDescription: string;
      startDate: string;
      endDate: string;
      taskStatus: string;
    }
  ];
}
interface Response {
  data: {
    tasks: [
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

export default function TaskCard(props: Props) {
  //
  // declarations
  // -------------
  const dispatch = useDispatch();

  //
  // handle delete tasks
  // ---------------------
  const { tasks } = props;

  const handleDeleteTask = (e: string) => {
    axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/user/task`, {
        data: { taskId: e },
      })
      .then((res:Response) => {
        // pending tasks
        const pendingTasks = res.data.tasks.filter(
          (task) => task.taskStatus === "pending"
        );
        // completed tasks
        const completedTasks = res.data.tasks.filter(
          (task) => task.taskStatus === "completed"
        );
        // incompleted tasks
        const incompletedTasks = res.data.tasks.filter(
          (task) => task.taskStatus === "incompleted"
        );
        dispatch(userTasks(pendingTasks));
        dispatch(userCompletedTasks(completedTasks));
        dispatch(userIncomletedTasks(incompletedTasks));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {tasks && tasks.length > 0 ? (
        tasks?.map((task) => (
          <Box key={task._id}>
            <Box
              width={{ md: "100%", xs: "100%" }}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={{ md: 1, xs: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: "20px",
                  mt: "20px",
                  width: "100%",
                  boxShadow: "0px 5px 20px",
                }}
                variant="outlined"
              >
                <Box
                  width={"100%"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    m: "auto",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                  textAlign={"start"}
                >
                  <CardContent
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      m: "auto",
                      justifyContent: "start",
                      alignItems: "start",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        component="span"
                        fontSize={{ md: 20, xs: 15 }}
                      >
                        {task.taskTitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="span"
                        fontSize={{ md: 10, xs: 5 }}
                        color={"text.secondary"}
                      >
                        Dead Line: {task?.endDate?.slice(0, 10)}
                      </Typography>
                    </div>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography
                        fontSize={{ md: 15, xs: 10 }}
                        sx={{ mb: 1.5, wordBreak:"break-word", wordWrap:"break-word" }}
                        color="text.secondary"
                      >
                        {task.taskDescription}
                      </Typography>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => {
                            // navigate("/profile");
                            handleDeleteTask(task._id);
                          }}
                        >
                          <Delete titleAccess="Delete" />
                        </Button>
                      </CardActions>
                    </Box>
                  </CardContent>
                </Box>
              </Card>
            </Box>
          </Box>
        ))
      ) : (
        <Typography>No Tasks to show</Typography>
      )}
    </>
  );
}
