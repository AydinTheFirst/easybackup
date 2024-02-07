import { DarkThemeToggle, Navbar } from "flowbite-react";
import { FaBars } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { DashboardSide } from "./Sidebar";
import { Title } from "@/components/Title";

interface NavProps {
  sidebarVisible: boolean;
  setSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DashboardNav = ({
  sidebarVisible,
  setSidebarVisible,
}: NavProps) => {
  const isMobile = window.innerWidth < 768;
  const navbarWidth =
    sidebarVisible && !isMobile ? "calc(100% - 260px)" : "100%";

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <Navbar
        id="navbar"
        className={`fixed left-0 top-0 z-40 border-b transition-all`}
        style={{
          width: navbarWidth,
          marginLeft: sidebarVisible ? "260px" : "0",
        }}
        fluid
      >
        {<SidebarToggler visible={sidebarVisible} onClick={toggleSidebar} />}

        <Navbar.Brand href="/dashboard">
          <Title />
        </Navbar.Brand>

        <div className="flex gap-1 md:order-2 md:gap-3">
          <DarkThemeToggle />
        </div>
      </Navbar>

      <DashboardSide visible={sidebarVisible} />
    </>
  );
};

const SidebarToggler = ({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="rounded-lg p-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
    >
      {visible ? (
        <FaArrowRightArrowLeft className="text-lg" />
      ) : (
        <FaBars className="text-lg" />
      )}
    </button>
  );
};
