import React from "react";
import btn_styles from "@/styles/button.module.css";

function PrimaryButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`${className} ${btn_styles.button} w-full`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SignInWithButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button className={`${className} w-full`} onClick={onClick}>
      {children}
    </button>
  );
}

function ReloadButton({ onClick }: { onClick: () => void }) {
  return (
    <button className={btn_styles.button} onClick={onClick}>
      Reload
    </button>
  );
}

export { PrimaryButton, ReloadButton, SignInWithButton };
