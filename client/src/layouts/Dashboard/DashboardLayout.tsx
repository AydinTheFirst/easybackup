import { useEffect, useState } from "react";
import { DashboardNav } from "./Navbar";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const isMobile = window.innerWidth < 768;
  const appWidth = sidebarVisible && !isMobile ? "calc(100% - 260px)" : "100%";

  useEffect(() => {
    setSidebarVisible(!isMobile);

    window.addEventListener("resize", () => {
      setSidebarVisible(!isMobile);
    });

    const navbar = document.getElementById("navbar");
    if (navbar) document.body.style.paddingTop = navbar.clientHeight + "px";

    return () => {
      window.removeEventListener("resize", () => {
        setSidebarVisible(window.innerWidth > 768);
      });

      if (navbar) document.body.style.paddingTop = "0";
    };
  }, [isMobile]);

  useEffect(() => {
    document.getElementById("root")?.classList.add("overflow-x-hidden");
    return () => {
      document.getElementById("root")?.classList.remove("overflow-x-hidden");
    };
  }, []);

  return (
    <>
      <DashboardNav
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
      />
      <br />
      <main
        id="app"
        className={`transition-all container`}
        style={{
          width: appWidth,
          marginLeft: sidebarVisible && !isMobile ? "260px" : "auto",
        }}
      >
        {children}
      </main>
      <br />
    </>
  );
};
