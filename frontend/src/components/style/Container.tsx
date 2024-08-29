import { Box } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function Container(props: Props) {
  return (
    <>
      <Box width="100%" minHeight="100vh">
        <Box width="90%" minHeight="90vh" margin="auto">
          {props.children}
        </Box>
      </Box>
    </>
  );
}
