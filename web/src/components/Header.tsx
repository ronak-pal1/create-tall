import { LiaArrowRightSolid } from "react-icons/lia";
import { CiStar } from "react-icons/ci";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-transparent flex justify-between items-center sticky top-0 z-50 px-8 py-7 backdrop-blur-sm">
      <div>
        <h1 className="text-xl text-white">Create Tall</h1>
      </div>
      <div className="flex items-center gap-5">
        <Link
          to="https://github.com/ronak-pal1/create-tall"
          target="_blank"
          className="text-white bg-black border border-neutral-700 shadow-2xl shadow-blue-300 px-5 py-1 text-sm rounded-full cursor-pointer hover:scale-105 transition-all font-light flex items-center gap-2"
        >
          <p>Star on GitHub</p>
          <CiStar />
        </Link>
        <Link
          to="https://tall.docs.ronakpaul.com"
          target="_blank"
          className="text-white bg-blue-700 px-5 py-1 text-sm rounded-full cursor-pointer hover:scale-105 transition-all font-light flex items-center gap-2"
        >
          <p>Read Docs</p>
          <LiaArrowRightSolid />
        </Link>
      </div>
    </header>
  );
};

export default Header;
