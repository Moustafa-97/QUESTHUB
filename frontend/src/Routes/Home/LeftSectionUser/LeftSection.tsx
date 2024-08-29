import { Add, Done, Edit, Fullscreen } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  userTasks,
  userCompletedTasks,
  userIncomletedTasks,
} from "../../../Redux/Tools/HandleUserTasks";
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
  };
}
export default function LeftSection() {
  const tasks = useSelector((state: Props) => state?.tasks?.pendingTasks);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");

  const handleDoneTask = async (taskID: string) => {
    await axios
      .patch(`${import.meta.env.VITE_API_BASE_URL}/user/task`, {
        taskId: taskID,
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
      <Box
        width={"100%"}
        height={"100%"}
        display={"grid"}
        gridTemplateColumns={"100%"}
        sx={{
          gridTemplateRows: "90% 10%",
          gridTemplateAreas: `"tasks"
          "add"`,
        }}
      >
        {/* tasks */}
        <ul
          style={{
            gridArea: "tasks",
            listStyle: "none",
            margin: "auto",
            width: "100%",
            height: "100%",
            paddingBottom: "100px",
            paddingLeft: 0,
          }}
        >
          {tasks && tasks.length > 0 ? (
            tasks?.map((task) => (
              <li
                key={task._id}
                style={{
                  margin: "auto",
                  width: "100%",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  sx={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      borderRadius: "20px",
                      mt: "20px",
                      width: "100%",
                      boxShadow: "0px 5px 10px",
                      height: "100%",
                    }}
                    variant="outlined"
                  >
                    <Box
                      onClick={() => navigate(`/task/${task._id}`)}
                      width={"100%"}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        m: "auto",
                        justifyContent: { md: "start", xs: "space-between" },
                        alignItems: "start",
                      }}
                      height={"100%"}
                      textAlign={"start"}
                    >
                      <CardContent
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          m: { md: "auto", xs: 0 },
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

                        <Typography
                          fontSize={{ md: 15, xs: 10 }}
                          sx={{
                            mb: 1.5,
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                          }}
                          color="text.secondary"
                        >
                          {task.taskDescription}
                        </Typography>

                        <Typography variant="body2"></Typography>
                      </CardContent>
                    </Box>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => {
                          handleDoneTask(task._id);
                        }}
                      >
                        <Done titleAccess="Done" />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          navigate("/profile");
                        }}
                      >
                        <Edit titleAccess="Edit" />
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          navigate(`/task/${task._id}`);
                        }}
                      >
                        <Fullscreen titleAccess="Explore" />
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              </li>
            ))
          ) : (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"100%"}
              width={"100%"}
              textAlign={"center"}
              color={"text.secondary"}
              fontStyle={"italic"}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/create")}
            >
              <Typography
                variant="body1"
                component="span"
                fontSize={{ md: 20, xs: 15 }}
                fontWeight={"bold"}
              >
                No tasks yet
              </Typography>
            </Box>
          )}
        </ul>

        <Box
          width={{ md: "100%", xs: "100%" }}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={{ md: 1, xs: 0.5 }}
          gridArea={"add"}
        >
          <Button
            sx={{
              bgcolor: "background.paper",
              borderRadius: "50%",
              mt: "20px",
              boxShadow: "0px 5px 10px",
            }}
            onClick={() => {
              navigate("/create");
            }}
          >
            <Add titleAccess="Add new task" />
          </Button>
        </Box>
      </Box>
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
