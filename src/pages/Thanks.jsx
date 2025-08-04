import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Thanks = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate("/");
      return;
    }

    if (typeof clearCart === "function") {
      clearCart();
    } else {
      console.error("clearCart is not a function");
    }
  }, [clearCart, navigate, orderData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(amount));
  };

  const formatDate = (date) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(date)
      .toLocaleString("en-IN", options)
      .replace(
        /(\d+)([ap]m)/i,
        (match, time, period) => `${time} ${period.toUpperCase()}`
      );
  };

  return (
    <div className="w-full h-screen p-4 font-[Poppins] flex flex-col items-center justify-center text-stone-800">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="mb-6 text-center text-stone-600">
        Your order is placed. You will get the order within 5 - 7 business days.
      </p>

      <Link
        to="/"
        className="p-2.5 px-6 text-lg rounded-lg text-white bg-stone-800"
      >
        Back to Home
      </Link>

      <p className="mt-6 text-sm text-center text-stone-600">
        Need help? <br /> Contact us at support@yourstore.com
      </p>
    </div>
  );
};

export default Thanks;
