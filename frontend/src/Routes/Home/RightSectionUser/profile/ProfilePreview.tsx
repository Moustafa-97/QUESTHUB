import {
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Card,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import "./profileStyle.css";
import { useNavigate } from "react-router-dom";

interface UserState {
  Login: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
      level: number;
      _id: string;
      expPoints: number;
    };
  };
  Logged: boolean;
}
export default function ProfilePreview() {
  const navigate = useNavigate();
  const userInfo = useSelector((state: UserState) => state.Login.user);

  const card = (
    <Box
      width={"100%"}
      sx={{
        display: "flex",
        flexDirection: "column",
        m: "auto",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate("/profile");
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          m: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ width: 70, height: 70, mb: "15px" }}
          src={userInfo.avatar ? userInfo.avatar : ""}
        />
        <div className="percentage" style={{ width: "100%" }}>
          <div
            className="actualPercentage"
            style={{ width: (userInfo.expPoints / 1000) * 100 }}
          ></div>
        </div>
        <Typography
          variant="body1"
          component="div"
          fontSize={{ md: 30, xs: 20 }}
          textOverflow={"clip"}
        >
          {userInfo.firstName} {userInfo.lastName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Level: {userInfo.level}
        </Typography>
        <Typography variant="body2">EXP: {userInfo.expPoints}/1000</Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </Button>
      </CardActions>
    </Box>
  );
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card
        sx={{
          borderRadius: "20px",
          mt: "20px",
          width: "100%",
          boxShadow: "0px 5px 20px",
        }}
        variant="outlined"
      >
        {card}
      </Card>
    </Box>
  );
}
