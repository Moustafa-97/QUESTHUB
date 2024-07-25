import { Box, Button, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import {
  userCompletedTasks,
  userIncomletedTasks,
  userTasks,
} from "../../../Redux/Tools/HandleUserTasks";

interface input {
  taskTitle: string;
  taskDescription: string;
  startDate: Dayjs;
  endDate: Dayjs;
}
interface Response {
  status: number;
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
    message: string;
  };
}

export default function AddTask() {
  //
  // declarations
  // -------------
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //
  // manage states
  // --------------
  const [newTask, setNewTask] = useState<input>({
    taskTitle: "",
    taskDescription: "",
    startDate: dayjs(),
    endDate: dayjs(),
  });

  // message snackbar
  //------------------

  const [snackOpen, setSnackOpen] = useState(false);
  const [resMessage, setResMessage] = useState("");
  //
  // handle input change function
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewTask((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleChangeStartDate = (
    e: React.ChangeEvent<HTMLInputElement> | any
  ): void => {
    // const {  value } = e.target;
    setNewTask((prev) => {
      return { ...prev, startDate: e.toISOString() };
    });
  };
  const handleChangeEndDate = (
    e: React.ChangeEvent<HTMLInputElement> | any
  ): void => {
    // const {  value } = e.target;
    setNewTask((prev) => {
      return { ...prev, endDate: e.toISOString() };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    const { taskTitle, taskDescription, startDate, endDate } = newTask;
    e.preventDefault();
    if (taskTitle && taskDescription && startDate && endDate) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/user/task`, {
          newTask: newTask,
        })
        .then(async (res: Response) => {
          if (res.status === 200) {
            //
            setResMessage(await res.data.message);
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

            setSnackOpen(true);
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 2000);
          }
        })
        .catch((err) => console.log(err.response.data));
    } else {
      setResMessage("please fill all fields");
      setSnackOpen(true);
    }
  };

  //
  //  mui snackbar settings
  // -----------------------
  const handleClose = (reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  //
  // end mui snackbar settings
  // -------------------------

  return (
    <>
      {/* Signup form */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          maxHeight: "100vh",
          m: "auto",
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: "100%",
            m: "auto",
          }}
        >
          <Box
            onSubmit={(e: any): void => handleSubmit(e)}
            component="form"
            noValidate
            sx={{
              width: "90%",
              height: "100%",
              m: "auto",
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              required
              id="outlined-required"
              type="text"
              label="Task title"
              placeholder="Task Title"
              name="taskTitle"
              value={newTask?.taskTitle}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              required
              multiline
              rows={6}
              id="outlined-required"
              label="Task description"
              placeholder="Task description"
              name="taskDescription"
              value={newTask?.taskDescription}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem sx={{ width: "100%" }} label={"Enter start date"}>
                <DatePicker
                  // value={newTask?.startDate.toISOString()}
                  name="startDate"
                  onChange={handleChangeStartDate}
                />
              </DemoItem>
              <DemoItem sx={{ width: "100%" }} label={"Enter end date"}>
                <DatePicker
                  // value={newTask?.startDate}
                  name="endDate"
                  onChange={handleChangeEndDate}
                />
              </DemoItem>
            </LocalizationProvider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={(e: any) => handleSubmit(e)}
              sx={{
                mt: 3,
                mb: 2,
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>

      {/* snackbar */}
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
