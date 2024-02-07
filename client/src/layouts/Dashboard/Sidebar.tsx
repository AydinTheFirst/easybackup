import { useUser } from "@/hooks/useUser";
import { Avatar, Sidebar } from "flowbite-react";
import { FaAws, FaChartPie, FaDatabase } from "react-icons/fa";

interface SideProps {
  visible: boolean;
}

export const DashboardSide = ({ visible }: SideProps) => {
  return (
    <>
      <Sidebar
        className={`fixed left-0 top-0 z-40 h-full w-[260px] border-e transition-all dark:border-gray-700`}
        style={{ marginLeft: visible ? "0" : "-260px" }}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex">
            <Profile />
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            <Sidebar.Item href="/dashboard" icon={FaChartPie}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="/dashboard/databases" icon={FaDatabase}>
              Databases
            </Sidebar.Item>
            <Sidebar.Item href="/dashboard/destinations" icon={FaAws}>
              Destinations
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
};

const Profile = () => {
  const { user } = useUser();
  return (
    <Avatar rounded>
      <div className="space-y-1 font-medium dark:text-white">
        <div>{user?.displayName}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {user?.email}
        </div>
      </div>
    </Avatar>
  );
};
