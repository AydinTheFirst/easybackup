import { Button } from "flowbite-react";
import { Footer } from "../components/Footer";
import { NavbarComponent } from "../components/Navbar";

export const App = () => {
  return (
    <>
      <NavbarComponent />

      <main className="container mt-10 p-3 dark:text-white">
        {/** BOX */}
        <div className="box rounded-lg">
          <span className="rounded-lg bg-slate-200 dark:bg-gray-900"></span>
          <img src="/logo.png" width={"200px"} alt="" className="p-5" />
        </div>
        <div className="text-center mt-10">
          <div className="colored font-bold text-3xl">
            Experience the Extraordinary
            <div className="text-black dark:text-white text-lg">
              Let Dreams Come True
            </div>
          </div>
        </div>

        <div className="my-5 flex justify-center">
          <Button href="/dashboard" outline gradientDuoTone="purpleToBlue">
            Go to dashboard
          </Button>
        </div>
      </main>

      <Footer />
    </>
  );
};
