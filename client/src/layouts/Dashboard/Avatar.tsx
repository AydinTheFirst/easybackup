import { Avatar, Dropdown } from "flowbite-react";

export const AvatarBox = () => {
  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <Dropdown
      label={<Avatar alt="User settings" rounded />}
      arrowIcon={false}
      inline
    >
      <Dropdown.Header>
        <span className="block text-sm">Halil Aydın</span>
        <span className="block truncate text-sm font-medium">
          name@fristroop.com
        </span>
      </Dropdown.Header>
      <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={signOut}>Sign out</Dropdown.Item>
    </Dropdown>
  );
};
