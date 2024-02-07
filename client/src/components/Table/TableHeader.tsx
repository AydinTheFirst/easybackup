import { Button, TextInput } from "flowbite-react";
import { FaSearch } from "react-icons/fa";

interface TableHeaderProps {
  label: string;
  url: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TableHeader = ({ label, url, handleSearch }: TableHeaderProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold">{label}</h2>
      </div>
      <div className="flex gap-3">
        <TextInput icon={FaSearch} sizing={"sm"} onChange={handleSearch} />
        <Button href={url} color="blue" size={"xs"}>
          Create {label}
        </Button>
      </div>
    </header>
  );
};
