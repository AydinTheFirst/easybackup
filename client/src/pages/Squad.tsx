import { NavbarComponent } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card, ListGroup } from "flowbite-react";

export const Squad = () => {
  return (
    <>
      <NavbarComponent />

      <main className="flex justify-center p-10 items-center h-full">
        <Card className="max-w-sm">
          <div className="flex flex-col items-center pb-10">
            <img
              alt="pp"
              height="96"
              src="https://avatars.githubusercontent.com/u/84444757?v=4"
              width="96"
              className="mb-3 rounded-full shadow-lg"
            />
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              AydinTheFirst
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Fullstack Developer
            </span>
            <div className="my-10">
              <ListGroup className="w-48">
                <ListGroup.Item>
                  <a href="https://github.com/AydinTheFirst">
                    <i className="fa-brands fa-github me-2"></i>
                    AydinTheFirst
                  </a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <a href="https://www.instagram.com/aydinthefirst/">
                    <i className="fa-brands fa-instagram me-2"></i>
                    aydinthefirst
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </div>

            <div className="flex gap-5 dark:text-white">
              <a href="/"></a>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </>
  );
};
