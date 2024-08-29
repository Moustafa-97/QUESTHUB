import { Box } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function Container(props: Props) {
  return (
    <>
      <Box width="100%" minHeight="90vh" mt={0}>
        <Box width="90%" minHeight="80vh" margin="auto">
          {props.children}
        </Box>
      </Box>
    </>
  );
}
