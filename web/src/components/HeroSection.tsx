import { GoChevronRight } from "react-icons/go";
import { MdOutlineCopyAll } from "react-icons/md";
import { GetRequiredSvg } from "./svg";
import terminalImage from "/terminal.png";

const HeroSection = () => {
  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-tall");
  };

  return (
    <section className="h-[80vh] md:h-screen w-full relative">
      <div className="text-white w-full text-center flex flex-col justify-center items-center mt-36 lg:mt-10 gap-y-20">
        <div className="text-center space-y-7 px-10 z-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Create Tall CLI</h2>
          <p className="text-sm sm:text-lg font-light">
            A powerful tool to create any stack applications with ease and all
            setup ready
          </p>
        </div>

        <div className="w-[75%] sm:w-[400px] shadowed-div flex justify-between items-center bg-black py-4 px-5 rounded-xl z-10">
          <div className="flex items-center gap-2">
            <GoChevronRight className="text-amber-500" />
            <p className=" text-sm text-neutral-300">npx create-tall</p>
          </div>

          <div>
            <MdOutlineCopyAll
              onClick={handleCopy}
              className="cursor-pointer hover:text-amber-500 active:text-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0  w-full  flex justify-center z-10">
        <div className="h-[280px] sm:h-[450px] lg:h-[500px] w-[90%] lg:w-[65%] bg-black rounded-2xl shadowed-div">
          <img
            src={terminalImage}
            alt="Terminal Image"
            className="w-full h-full object-fill"
          />
        </div>
      </div>

      <div className="absolute right-20 top-36 sm:top-40 rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="tailwindcss" size={window.innerWidth < 1024 ? 60 : 100} />
      </div>

      <div className="absolute left-10 top-30 rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="reactjs" size={window.innerWidth < 1024 ? 60 : 100} />
      </div>

      <div className="absolute left-14 top-[350px] rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="nextjs" size={window.innerWidth < 1024 ? 60 : 70} />
      </div>

      <div className="absolute left-36 top-[300px] md:top-[500px] -rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="redux" size={window.innerWidth < 1024 ? 60 : 80} />
      </div>

      <div className="absolute right-40 top-[300px] md:top-[500px] rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="expressjs" size={window.innerWidth < 1024 ? 60 : 80} color="#61DAFB" />
      </div>

      <div className="absolute right-14 top-[350px] rotate-12 opacity-45 z-0">
        <GetRequiredSvg logoName="go" size={window.innerWidth < 1024 ? 60 : 80} color="#61DAFB" />
      </div>
    </section>
  );
};

export default HeroSection;
