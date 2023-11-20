/* eslint-disable react/display-name */
import useAuth from "@/utils/useAuth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";

export default function withAuthGuard<P>(Component: React.ComponentType<P>) {
  return (props: any) => {
    const router = useRouter();
    const { loading, error, isAuthenticated } = useAuth();

    if (loading) return <LoadingScreen />;

    if (error) return <ErrorScreen error={error} />;

    useEffect(() => {
      if (!isAuthenticated) router.replace("/login");
      if (isAuthenticated) router.replace("/");
    }, [isAuthenticated]);

    return <Component {...props} />;
  };
}
