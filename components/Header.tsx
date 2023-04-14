import styles from "@/styles/chat.module.css";
const Header = () => {
  return (
    <div className={styles.header}>
      <h4 className="font-medium text-lg">FemGPT</h4>
      <p className="text-gray-400 text-xs mt-1.5">Female Health Advisor</p>
    </div>
  );
};

export default Header;
