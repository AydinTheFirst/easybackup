import { Select } from "flowbite-react";
import { useEffect, useState } from "react";

interface SelectInputProps {
  name: string;
  defaultValue: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    id: string;
    name: string;
    [key: string]: any;
  }>;
}

export const SelectInput = (props: SelectInputProps) => {
  const { name, defaultValue, onChange, options } = props;

  const [value, setValue] = useState<string | undefined>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChange(e);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Select
      name={name}
      sizing={"sm"}
      value={value ?? ""}
      onChange={handleOnChange}
      required
    >
      <option value="" disabled>
        Please Select
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </Select>
  );
};
