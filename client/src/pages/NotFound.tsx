import space from "../assets/space.png";
import { Button } from "flowbite-react";

export const NotFound = () => {
  return (
    <>
      <div
        style={style}
        className="text-white flex justify-center items-center flex-col gap-10 font-bold py-[10rem]"
      >
        <div className="text-4xl shadow">
          It looks like you are lost. There is nothing to see!
        </div>
        <div className="text-6xl underline">404</div>
        <div className="text-2xl">
          The page you are looking for is not found!
        </div>
        <div className="flex justify-center">
          <Button outline gradientDuoTone="purpleToBlue" size={"xl"} href="/">
            <i className="fa-solid fa-shuttle-space me-3"></i>
            Go Home
          </Button>
        </div>
      </div>
    </>
  );
};

const style: React.CSSProperties = {
  height: "100vh",
  width: "100%",
  backgroundImage: `url(${space})`,
  backgroundSize: "cover",
  textAlign: "center",
  textShadow: "0 0 10px black",
};
