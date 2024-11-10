import { Link } from "react-router-dom";
import { HiExclamationCircle } from "react-icons/hi";

const NotFoundPage = () => {
  return (
    <div className="bg-hero-pattern4 min-h-screen w-full flex flex-col justify-center gap-8 items-center bg-cover">
      <div className="border bg-white/60 rounded-2xl p-12">
        <div className="flex flex-col justify-center items-center gap-4 text-gray-900">
          <h2 className="text-5xl  font-extrabold">
            The page you are Looking For
          </h2>
          <h2 className="text-5xl  font-extrabold">Doesn't exist</h2>
          <div className="text-7xl">
            <HiExclamationCircle />
          </div>
        </div>
      </div>
      <div className="bg-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 cursor-pointer">
        <button>
          <Link to="/dashboard">Back to Dashboard</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
