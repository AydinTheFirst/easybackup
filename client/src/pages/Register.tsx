import { http } from "@/http";
import { Button, Card, FloatingLabel } from "flowbite-react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const bg: React.CSSProperties = {
    backgroundImage: "url('/wallpaper.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      await http.post("/auth/register", data);

      const res = await http.post("/auth/login", data);
      localStorage.setItem("token", res.token);

      location.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed left-0 top-0 -z-10 h-full w-full" style={bg} />
      <main className="container h-[100vh] dark:text-white">
        <div className="flex h-full items-center">
          <div className="col-lg-4 col-md-6 mx-auto flex">
            <Card className={"w-full"}>
              <div>
                <div className="flex justify-center">
                  <img src="/logo.png" width={100} alt="" />
                </div>
                <h3 className="text-center text-2xl font-bold">
                  Fristroop Development
                </h3>
                <br />
                <h6 className="text-lg font-bold">
                  Please register to continue
                </h6>
              </div>
              <form className="row g-3" onSubmit={handleSubmit}>
                <div>
                  <FloatingLabel
                    variant="standard"
                    label="Display Name"
                    name="displayName"
                    required
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="standard"
                    label="Username"
                    name="username"
                    required
                  />
                </div>
                <div>
                  <FloatingLabel
                    variant="standard"
                    label="Email address"
                    name="email"
                    required
                  />
                </div>
                <div className="relative">
                  <FloatingLabel
                    variant="standard"
                    label="Password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    className="absolute end-3 top-0 me-3 mt-3"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                <div>
                  <Button
                    type="submit"
                    color="blue"
                    className="rounded-none"
                    fullSized
                  >
                    Register
                  </Button>
                </div>
              </form>
              <div>
                <Button type="submit" href="/login" color="gray" fullSized pill>
                  <span className="me-2">Already have an account?</span>
                  <span className="text-blue-400">Login now</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
};
