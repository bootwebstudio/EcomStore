import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen p-4 text-center flex flex-col items-center justify-center font-[Poppins]">
      {/* Icon */}
      <div className="text-5xl text-stone-400 mb-4">
        <i className="ri-error-warning-line"></i>
      </div>

      {/* Error Code + Message */}
      <h1 className="text-4xl font-bold text-stone-800">404</h1>
      <p className="text-lg text-stone-600 mt-2">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* CTA */}
      <Link
        to="/"
        className="mt-4 p-2.5 px-6 text-lg rounded-lg text-white bg-stone-800"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
