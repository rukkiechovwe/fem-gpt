import React from "react";
import withAuthGuard from "./withAuthGuard";

interface Props {
  children: React.ReactElement;
}

const Scaffold: React.FC<Props> = ({ children }: Props) => {
  return <>{children}</>;
};

export default withAuthGuard(Scaffold);
