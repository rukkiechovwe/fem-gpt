import React from "react";
import { ReloadButton } from "./Button";

const ErrorScreen = ({ error }: { error: string }) => (
  <div className="h-screen w-screen flex flex-col items-center justify-center">
    <h1 className="text-2xl sm:text-3xl font-medium">{error}</h1>
    <ReloadButton onClick={() => window.location.reload()} />
  </div>
);

export default ErrorScreen;
