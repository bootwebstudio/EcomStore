import { Link } from "react-router-dom";

// Data
import storeData from "../storeData";

const Footer = () => {
  return (
    <footer className="w-full h-full p-4 bg-stone-100">
      <div className="flex gap-4 flex-col sm:flex-row justify-between">
        {/* Brand + Tagline */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold leading-none">{storeData.BRAND_NAME}</h2>
          <p className="text-sm leading-none text-stone-600">
            Clean floors. Zero effort.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="text-sm flex flex-col">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </li>

            <li>
              <a href={`mailto:${storeData.EMAIL}`} className="hover:underline">
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Support</h4>
          <p className="text-sm">Email: {storeData.EMAIL}</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 border-t-2 pt-4 text-center leading-none text-stone-600">
        © {new Date().getFullYear()} Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
