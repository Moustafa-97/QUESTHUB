import { Button } from "@mui/material";
import React from "react";

interface Props {
  onClick: () =>
    | React.FormEvent<HTMLInputElement>
    | React.FormEvent<HTMLFormElement>
    | Promise<void>
    | void
    | unknown
    | null;
  content: string;
  mdFont: number;
  xsFont: number;
  icon: React.ReactNode | React.ReactElement | null;
}
export default function ButtonComp(props: Props) {
  return (
    <>
      <Button
        variant="contained"
        endIcon={props.icon}
        fullWidth
        sx={{
          borderRadius: "10px",
          fontSize: { md: props.mdFont, xs: props.xsFont },
        }}
        onClick={props.onClick}
      >
        {props.content}
      </Button>
    </>
  );
}
