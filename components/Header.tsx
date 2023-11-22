import { SetStateAction, useState } from "react";
import styles from "@/styles/header.module.css";
import useFemGPT from "@/utils/useFemGPT";
import useAuth from "@/utils/useAuth";
import Image from "next/image";

const Header = () => {
  const { clearConversation } = useFemGPT();
  const { logout } = useAuth();
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  return (
    <div className={styles.header}>
      <h4 className="font-medium text-lg">FemGPT</h4>
      <p className="text-gray-400 text-xs mt-1.5">Female Health Advisor</p>
      <div className={styles.user} onClick={() => setOpenPopup(true)}>
        <Image
          src="/assets/icon/user_icon.png"
          width={45}
          height={45}
          alt="user_icon"
        />
        {!openPopup ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="#1d261f"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="#1d261f"
            viewBox="0 0 256 256"
          >
            <path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>
          </svg>
        )}
      </div>

      {openPopup && (
        <Popup
          setOpenPopup={setOpenPopup}
          clearConversation={clearConversation}
          logout={logout}
        />
      )}
    </div>
  );
};

export default Header;

const Popup = ({
  setOpenPopup,
  clearConversation,
  logout,
}: {
  setOpenPopup: (value: SetStateAction<boolean>) => void;
  clearConversation: () => void;
  logout: () => void;
}) => (
  <>
    <div className={styles.popup_overlay} onClick={() => setOpenPopup(false)} />
    <ul
      className={styles.popup}
      onClick={() => {
        setOpenPopup(true);
      }}
    >
      <li onClick={clearConversation}>Clear conversations</li>
      <li onClick={logout}>Logout</li>
    </ul>
  </>
);
