import React from "react";
import useAuth from "@/utils/useAuth";
import styles from "@/styles/login.module.css";
import btn_styles from "@/styles/button.module.css";
import { PrimaryButton, SignInWithButton } from "@/components/Button";
import Image from "next/image";

function Login() {
  const { guestLogin, googleSignIn, facebookLogin } = useAuth();
  return (
    <div className={styles.login}>
      <h4 className="logo">FemGPT</h4>
      <div className={styles.login_box}>
        <h1 className={styles.login_title}>Login</h1>
        <PrimaryButton onClick={() => guestLogin()}>
          Signin as Guest
        </PrimaryButton>
        <p className={styles.divider}>or sign in with:</p>
        <SignInWithButton
          onClick={() => googleSignIn()}
          className={btn_styles.google}
        >
          <Image
            src="assets/icon/google-48.svg"
            alt="google"
            width={20}
            height={20}
          />
          <span>Google</span>
        </SignInWithButton>
        <SignInWithButton
          onClick={() => facebookLogin()}
          className={btn_styles.facebook}
        >
          <Image
            src="assets/icon/facebook-50.svg"
            alt="google"
            width={20}
            height={20}
          />
          <span>Facebook</span>
        </SignInWithButton>
      </div>
    </div>
  );
}

export default Login;
