import { Edit } from "@mui/icons-material";
import { Avatar, Box, Button, CardActions, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../Home/RightSectionUser/profile/profileStyle.css";
import TaskCard from "../../components/TasksCard/TaskCard";
import { handleSelection } from "../../Redux/Tools/ProfileSectionSelector";

interface State {
  Login: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      expPoints: number;
      level: number;
      theme: string;
    };
    logged: boolean;
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

export default function Profile() {
  //
  // declarations
  // -------------
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser = useSelector((state: State) => state.Login.user);

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
  const section = useSelector((state) => state?.selectedSection?.section);

  //
  // Edit functions
  // ---------------
  // states
  // ---------
  const [name, setName] = useState(false);
  // functions
  // ----------
  const handleEditName = (e: HTMLInputElement) => {
    setName(!name);
    console.log("edit name");
  };
  const handleSection = (e: HTMLInputElement) => {
    dispatch(handleSelection(e));
  };

  return (
    <>
      <Box
        width={"100%"}
        display={{ md: "flex" }}
        justifyContent="center"
        alignItems="center"
        sx={{
          borderRadius: "20px",
          boxShadow: "0px 5px 20px",
          minHeight: "100vh",
          maxHeight: "fit-content",
          padding: "0 10px",
          marginTop: "10px",
          marginBottom: "10px",
          // overflow: "hidden",
        }}
      >
        {/* profile pic (in update *database required*) */}
        <Box
          width={{ md: "20%", xs: "100%" }}
          minHeight={{ md: "100vh", xs: "fit-content" }}
          textAlign={"center"}
          mt={0}
          alignSelf={"start"}
        >
          <Avatar
            sx={{
              width: { md: "75%", xs: "30%" },
              height: "auto",
              m: "20px auto",
            }}
          />
          <Typography
            variant="body2"
            component="span"
            color="text.secondary"
            sx={{ m: "auto", mt: "20px", width: "100%" }}
          >
            you will be able to add your profile picture soon !!!
          </Typography>
        </Box>
        {/* ------------------------------ */}
        {/* user details name/email.... ++++ user acheivements *number of tasks pending and ended and incomleted*  */}
        <Box
          width={{ md: "80%", xs: "100%" }}
          minHeight={{ md: "100vh", xs: "fit-content" }}
          mt={{ md: "60px", xs: "20px" }}
          ml={{ md: "20px", xs: "0px" }}
        >
          {/* name */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            {name ? (
              <Typography
                variant="body2"
                component="span"
                display={"block"}
                color="text.primary"
                sx={{ m: "auto", width: "95%" }}
                fontWeight={900}
                letterSpacing={0.7}
                fontSize={{ md: 45, xs: 25 }}
                fontFamily={'"Playwrite ES", cursive'}
              >
                {/* Moustafa Adel */}
                {/* {loggedUser.firstName} {loggedUser.lastName} */}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                component="span"
                display={"block"}
                color="text.primary"
                sx={{ m: "auto", width: "95%" }}
                fontWeight={900}
                letterSpacing={0.7}
                fontSize={{ md: 45, xs: 25 }}
                fontFamily={'"Playwrite ES", cursive'}
              >
                {loggedUser.firstName} {loggedUser.lastName}
              </Typography>
            )}
            <Button onClick={(e: HTMLInputElement) => handleEditName(e)}>
              <Edit />
            </Button>
          </Box>
          {/* level */}
          <Box display={"block"} width={"100%"}>
            <Typography
              variant="body2"
              component="span"
              display={"block"}
              color="text.primary"
              fontWeight={900}
              letterSpacing={0.7}
            >
              Level: {loggedUser.level}
            </Typography>
          </Box>
          {/* exp points */}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Typography
              variant="body2"
              component="span"
              display={"block"}
              color="text.primary"
              sx={{ m: "auto", width: "95%" }}
              fontWeight={900}
              letterSpacing={0.7}
            >
              experience points: {loggedUser.expPoints}
            </Typography>
            <div className="percentage" style={{ width: "100%" }}>
              <div
                className="actualPercentage"
                style={{ width: (loggedUser.expPoints / 1000) * 100 }}
              ></div>
            </div>
          </Box>
          <Box width={"100%"} height={"100%"} mt={{ md: "20px", xs: "10px" }}>
            {/* section select */}
            <CardActions>
              <Button
                onClick={(e) => {
                  handleSection(e.target.innerText.toLowerCase());
                  console.log(e.target.innerText.toLowerCase());
                }}
                sx={{
                  bgcolor: section === "pending" ? "divider" : null,
                  color: section === "pending" ? "text.primary" : null,
                  "&:hover": { bgcolor: "divider", color: "text.primary" },
                }}
              >
                Pending
              </Button>
              <Button
                onClick={(e) => {
                  handleSection(e.target.innerText.toLowerCase());
                  console.log(e.target.innerText.toLowerCase());
                }}
                sx={{
                  bgcolor: section === "completed" ? "divider" : null,
                  color: section === "completed" ? "text.primary" : null,
                  "&:hover": { bgcolor: "divider", color: "text.primary" },
                }}
              >
                Completed
              </Button>
              <Button
                onClick={(e) => {
                  handleSection(e.target.innerText.toLowerCase());
                  console.log(e.target.innerText.toLowerCase());
                }}
                sx={{
                  bgcolor: section === "incompleted" ? "divider" : null,
                  color: section === "incompleted" ? "text.primary" : null,
                  "&:hover": { bgcolor: "divider", color: "text.primary" },
                }}
              >
                Incompleted
              </Button>
            </CardActions>
            {/* task cards */}
            <TaskCard
              tasks={
                section === "pending"
                  ? pendingTasks
                  : section === "completed"
                  ? completedTasks
                  : incompletedTasks
              }
            />
          </Box>
        </Box>
        {/* user acheivements *number of tasks pending and ended and incomleted* */}
      </Box>
    </>
  );
}
