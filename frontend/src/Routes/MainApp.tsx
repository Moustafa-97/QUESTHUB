import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/header/Header";
import Login from "./Login/Login";
import axios from "axios";
import { useEffect } from "react";
import GuestHomePage from "./Home/GuestHomePage";
import UserHomePage from "./Home/UserHomePage";
import Profile from "./Profile/Profile";
import { userData, userLogged } from "../Redux/Tools/HandleUserLogin";
import { useDispatch, useSelector } from "react-redux";
import TasksManager from "./Tasks/TasksManager";
import {
  userCompletedTasks,
  userIncomletedTasks,
  userTasks,
} from "../Redux/Tools/HandleUserTasks";
import Signup from "./signup/Signup";
import MyTasks from "./Tasks/userTasks/MyTasks";
import AddTask from "./Tasks/addNewTask/AddTask";
import ForgetPassword from "./Login/forgetPassword/ForgetPassword";
import Otp from "./Login/forgetPassword/otp/Otp";
import AdminSettings from "./settings/AdminSettings";
import Container from "../components/style/Container";

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

interface logged {
  Login: {
    logged: boolean;
  };
}
export default function MainApp() {
  //
  // declarations
  // -------------
  const dispatch = useDispatch();
  const isLogged = useSelector((state: logged) => state.Login.logged);
  const tasks = useSelector((state: any) => state.tasks.pendingTasks).length;

  //
  // userLogged handling
  // -------------------
  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/user/isLogged`,
        // cookies::
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        dispatch(userLogged(true));
        dispatch(userData(res.data.user));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  //
  // userTasks handling
  // -------------------
  useEffect(() => {
    if (isLogged) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/user/task`, {
          withCredentials: true,
        })
        .then(async (res: Response) => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged]);

  return (
    <>
      <BrowserRouter>
        <Header>
          <Container>
          <Routes>
            {isLogged ? (
              <Route index path={"/"} element={<UserHomePage />} />
            ) : (
              <Route index path={"/"} element={<GuestHomePage />} />
            )}
            <Route index path={"/task/:taskId"} element={<TasksManager />} />
            <Route index path={"/mytasks"} element={<MyTasks />} />
            <Route index path={"/create"} element={<AddTask />} />
            <Route index path={"/login"} element={<Login />} />
            <Route index path={"/signup"} element={<Signup />} />
            <Route
              index
              path={"/forget-password"}
              element={<ForgetPassword />}
            />
            <Route index path={"/otp"} element={<Otp />} />
            <Route index path={"/profile"} element={<Profile />} />
            <Route index path={"/settings"} element={<AdminSettings />} />
          </Routes>
          </Container>
        </Header>
      </BrowserRouter>
    </>
  );
}
