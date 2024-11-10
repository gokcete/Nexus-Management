import { TextHoverEffect2 } from "./ui/text-hover-effect2";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 h-[5rem] flex items-center justify-center text-white border-b border-gray-700 shadow-lg pt-4">
      <h1 className="text-5xl font-extrabold tracking-wider">
        <TextHoverEffect2 text="NEXUS" />
      </h1>
    </div>
  );
};

export default Header;
