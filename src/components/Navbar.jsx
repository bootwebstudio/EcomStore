import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import storeData from "../storeData";

// Icons
import { BiShoppingBag } from "react-icons/bi";

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <div className="w-full h-full p-4 flex items-center justify-between border-b-2">
      <Link to="/">
        <h2 className="text-2xl font-bold">{storeData.BRAND_NAME}</h2>
      </Link>

      <Link to="/cart" className="flex gap-2 items-center cursor-pointer">
        <h4>Cart({cartCount})</h4>
        <BiShoppingBag size="18px" />
      </Link>
    </div>
  );
};

export default Navbar;
