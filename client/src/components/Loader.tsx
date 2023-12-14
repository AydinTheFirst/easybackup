import { Spinner } from "flowbite-react";

export const Loader = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center z-10">
      <Spinner aria-label="Default status example" size={"xl"} />
    </div>
  );
};
