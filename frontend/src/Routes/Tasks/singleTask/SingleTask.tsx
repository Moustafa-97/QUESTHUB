import { Delete, Done, Edit } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  userCompletedTasks,
  userIncomletedTasks,
  userTasks,
} from "../../../Redux/Tools/HandleUserTasks";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface Response {
  data: {
    tasks: [
      {
        _id: string;
        taskTitle: string;
        TaskDescription: string;
        startDate: string;
        endDate: string;
        taskStatus: string;
        userId: number;
      }
    ];
    message: string;
    state: boolean;
  };
}

interface Task {
  task: any
}

export default function SingleTask(props: Task) {
  // declarations
  // -------------
  const task = props?.task;

  const dispatch = useDispatch();
  const taskID = useParams();
  const navigate = useNavigate();

  // states management
  // ------------------
  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");

  // functions
  // ----------
  const handleDoneTask = async () => {
    await axios
      .patch(`${import.meta.env.VITE_API_BASE_URL}/user/task`, {
        taskId: taskID.taskId,
        taskStatus: "completed",
        withCredentials: true,
      })
      .then(async (res: Response) => {
        setResMessage(res.data.message);

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
        //  mui snackbox
        setSnackOpen(true);
      })
      .then(() => {
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  //  mui snackbox
  const handleClose = (reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <>
      {task &&
        task.map((task:any) => (
          <Box key={task._id} minHeight={"100vh"}>
            {/* single task  */}
            <Box width={{ md: "100%", xs: "100%" }} minHeight={"100vh"}>
              {/* card style */}
              <Card
                sx={{
                  borderRadius: "20px",
                  mt: "20px",
                  width: "100%",
                  boxShadow: "0px 5px 20px",
                  height: "100%",
                }}
                variant="outlined"
              >
                <Box
                  width={"100%"}
                  minHeight={"100%"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                  textAlign={"start"}
                >
                  <CardContent
                    sx={{
                      width: "100%",
                    }}
                  >
                    {/* task title */}
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
                        fontSize={{ md: 50, xs: 25 }}
                      >
                        {task.taskTitle}
                      </Typography>
                      {/* task deadline */}
                      <Typography
                        variant="body1"
                        component="span"
                        fontSize={{ md: 20, xs: 10 }}
                        color={"text.secondary"}
                      >
                        Dead Line: {task?.endDate?.slice(0, 10)}
                      </Typography>
                    </div>
                    {/* task description */}
                    <Typography
                      fontSize={{ md: 30, xs: 15 }}
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                    >
                      {task.taskDescription}
                    </Typography>
                    <Typography variant="body2"></Typography>
                  </CardContent>
                  {/* end task card */}
                  {/* card action (buttons) */}
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        handleDoneTask();
                      }}
                    >
                      <Done titleAccess="Done" />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        // navigate("/profile");
                      }}
                    >
                      <Edit titleAccess="Edit" />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        // navigate("/profile");
                      }}
                    >
                      <Delete titleAccess="Explore" />
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Box>
          </Box>
        ))}
      <Snackbar
        message={resMessage}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackOpen}
        onClose={() => handleClose()}
      />
    </>
  );
}
