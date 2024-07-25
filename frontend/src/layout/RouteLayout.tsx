import { Box } from "@mui/material";
import React from "react";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}
export default function RouteLayout(props: Props) {
  return (
    <Box
      height="100vh"
      width={"95%"}
      border={1}
      borderColor={"red"}
      m={"auto"}
    >
      {props.children}
    </Box>
  );
}
