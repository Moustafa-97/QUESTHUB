import { Box } from "@mui/material";
import React from "react";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

export default function HomeLayout(props: Props) {
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"start"}
        flexDirection={"column"}
        m={"auto"}
        mt={2}
        gap={2}
        width={'100%'}
      >
        {props.children}
      </Box>
    </>
  );
}
