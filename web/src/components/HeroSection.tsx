import { GoChevronRight } from "react-icons/go";
import { MdOutlineCopyAll } from "react-icons/md";
import {GetRequiredSvg} from "./svg";
import terminalImage from "../assets/terminal.png"

const HeroSection = () => {
  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-tall");
  };

  return (
    <section className="h-screen w-full relative">
      <div className="text-white w-full text-center flex flex-col justify-center items-center mt-10 gap-y-20">
        <div className="text-center space-y-7">
          <h2 className="text-3xl font-bold">Create Tall CLI</h2>
          <p className="text-lg font-light">
            A powerful tool to create any stack applications with ease and all
            setup ready
          </p>
        </div>

        <div className="w-[400px] shadowed-div flex justify-between items-center bg-black py-4 px-5 rounded-xl">
          <div className="flex items-center gap-2">
            <GoChevronRight className="text-amber-500" />
            <p className=" text-sm text-neutral-300">npx create-tall</p>
          </div>

          <div>
            <MdOutlineCopyAll onClick={handleCopy} className="cursor-pointer hover:text-amber-500"/>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0  w-full  flex justify-center">
        <div className="h-[500px] w-[70%] bg-black rounded-2xl shadowed-div">
        <img src={terminalImage} alt="Terminal Image" width="100%" height="100%" className="object-cover"/>
        </div>
      </div>


      <div  className="absolute right-20 top-40 rotate-12 opacity-45">
        <GetRequiredSvg logoName="tailwindcss" size={100} />
      </div>

      <div  className="absolute left-10 top-30 rotate-12 opacity-45">
        <GetRequiredSvg logoName="reactjs" size={100} />
      </div>

      <div  className="absolute left-14 top-[350px] rotate-12 opacity-45">
        <GetRequiredSvg logoName="nextjs" size={70} />
      </div>

      <div  className="absolute left-20 top-[500px] -rotate-12 opacity-45">
        <GetRequiredSvg logoName="redux" size={80} />
      </div>

      <div  className="absolute right-20 top-[500px] rotate-12 opacity-45">
        <GetRequiredSvg logoName="expressjs" size={80} color="#61DAFB"/>
      </div>

      <div  className="absolute right-14 top-[350px] rotate-12 opacity-45">
        <GetRequiredSvg logoName="go" size={80} color="#61DAFB"/>
      </div>
    </section>
  );
};

export default HeroSection;
