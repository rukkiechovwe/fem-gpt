import { useState } from "react";
import styles from "@/styles/header.module.css";
import useFemGPT from "@/utils/useFemGPT";
import useAuth from "@/utils/useAuth";

const Header = () => {
  const { clearConversation } = useFemGPT();
  const { logout } = useAuth();
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  return (
    <div className={styles.header}>
      <h4 className="font-medium text-lg">FemGPT</h4>
      <p className="text-gray-400 text-xs mt-1.5">Female Health Advisor</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="#1d261f"
        viewBox="0 0 256 256"
        onClick={() => setOpenPopup(true)}
      >
        <path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z"></path>
      </svg>

      {openPopup && (
        <>
          <div
            className={styles.popup_overlay}
            onClick={() => setOpenPopup(false)}
          />
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
      )}
    </div>
  );
};

export default Header;
