import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    setDeliveryCharge,
    discount,
    setDiscount,
    activeCoupon,
    setActiveCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const calculateSubtotal = () => {
    return Math.round(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  };

  useEffect(() => {
    if (!activeCoupon) {
      setDiscount(0);
      setDeliveryCharge(0);
      return;
    }

    const subtotal = calculateSubtotal();

    switch (activeCoupon.type) {
      case "percentage":
        setDiscount(Math.round(subtotal * activeCoupon.value));
        setDeliveryCharge(0);
        break;
      case "fixed":
        setDiscount(Math.min(activeCoupon.value, subtotal));
        setDeliveryCharge(0);
        break;
      case "freeDelivery":
        setDiscount(0);
        setDeliveryCharge(0);
        break;
      default:
        setDiscount(0);
        setDeliveryCharge(0);
    }
  }, [cart, activeCoupon]);

  const applyCoupon = () => {
    const subtotal = calculateSubtotal();
    let newCoupon = null;

    switch (couponCode.toUpperCase()) {
      case "DISCOUNT15":
        newCoupon = { type: "percentage", value: 0.15 };
        setCouponMessage("15% discount applied!");
        break;
      case "FREESHIP":
        newCoupon = { type: "fixed", value: 50 };
        setCouponMessage("₹50 discount applied!");
        break;
      default:
        setCouponMessage("Invalid coupon code");
        setActiveCoupon(null);
        return;
    }

    setActiveCoupon(newCoupon);
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const total = Math.max(0, calculateSubtotal() - discount);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div className="w-full h-screen p-4 flex gap-4 flex-col font-[Poppins] text-stone-800">
      <h2 className="text-2xl font-bold">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
          {/* Icon */}
          <div className="text-5xl pb-4 text-stone-600">
            <i className="ri-shopping-cart-line"></i>
          </div>

          {/* Message */}
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="px-4 text-stone-600">
            Looks like you haven't added anything yet.
          </p>

          {/* CTA */}
          <Link
            to="/"
            className="p-4 px-0 text-blue-500 underline leading-none"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 mb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-2 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Coupon Code Section */}
          <div className="">
            <div className="pb-4 flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full p-2 border rounded-lg outline-none"
              />
              {activeCoupon ? (
                <button
                  onClick={removeCoupon}
                  className="p-2 px-4 rounded-lg text-white bg-red-500"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={applyCoupon}
                  className="p-2 px-4 rounded-lg text-white bg-stone-800"
                >
                  Apply
                </button>
              )}
            </div>
            <span
              className={`leading-none ${
                couponMessage === "Invalid coupon code"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {couponMessage}
            </span>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges:</span>
              <span>₹0</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-500">
                <span>Discount:</span>
                <span>-₹{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-4 mb-4 border-t pt-2">
              <span>Total:</span>
              <span>₹{formatCurrency(total)}</span>
            </div>

            <Link
              to="/checkout"
              className="w-full p-2.5 text-lg text-center rounded-lg block text-white bg-stone-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
