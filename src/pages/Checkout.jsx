import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { sendToTelegram } from "../utils/telegramBot";

const Checkout = () => {
  const { cart, discount, deliveryCharge = 0, activeCoupon } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    houseNo: "",
    roadName: "",
    landmark: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatOrderMessage = (orderData) => {
    const itemsList = orderData.cart
      .map(
        (item) =>
          `- ${item.name} (Qty: ${item.quantity}) - ₹${
            item.price * item.quantity
          }`
      )
      .join("\n");

    // Format date as "3 Aug, 2025 - 3:00 PM"
    const formatDate = (date) => {
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      return date
        .toLocaleString("en-IN", options)
        .replace(
          /(\d+)([ap]m)/i,
          (match, time, period) => `${time} ${period.toUpperCase()}`
        );
    };

    return `
<b>🛒 New Order Received</b>

<b>👤 Customer Details:</b>
├ Name: ${orderData.name}
├ Phone: ${orderData.phone}

<b>🏠 Shipping Address:</b>
├ House No/Building: ${orderData.houseNo}
├ Road/Area/Colony: ${orderData.roadName}
${orderData.landmark ? `├ Landmark: ${orderData.landmark}\n` : ""}
├ City: ${orderData.city}
├ State: ${orderData.state}
└ ZIP: ${orderData.zip}

<b>📦 Order Items:</b>
${itemsList}

<b>💳 Payment Method:</b>
${orderData.paymentMethod === "cod" ? "Cash on Delivery" : "UPI Payment"}

<b>💰 Order Summary:</b>
├ Subtotal: ₹${orderData.subtotal}
${orderData.discount > 0 ? `├ Discount: -₹${orderData.discount}\n` : ""}
${
  orderData.onlineDiscount > 0
    ? `├ Online Discount: -₹${orderData.onlineDiscount}\n`
    : ""
}
└ Delivery: ${
      orderData.deliveryCharge === 0 ? "FREE" : `₹${orderData.deliveryCharge}`
    }
<b>✅ Total: ₹${orderData.total}</b>

<b>⏰ Order Time:</b>
${formatDate(new Date())}
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const subtotal = calculateSubtotal();
      const onlineDiscount = formData.paymentMethod !== "cod" ? 15 : 0;
      const total = Math.max(
        0,
        subtotal - discount - onlineDiscount + deliveryCharge
      );

      const orderData = {
        ...formData,
        cart,
        subtotal,
        discount,
        onlineDiscount,
        deliveryCharge,
        total,
      };

      const telegramMessage = formatOrderMessage(orderData);
      await sendToTelegram(telegramMessage);
      navigate("/thanks", { state: { orderData } });
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(amount));
  };

  const subtotal = calculateSubtotal();
  const onlineDiscount = formData.paymentMethod !== "cod" ? 15 : 0;
  const total = Math.max(
    0,
    subtotal - discount - onlineDiscount + deliveryCharge
  );

  return (
    <div className="w-full h-full p-4 font-[Poppins] text-stone-800">
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {submitError}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Link to="/cart" className="text-blue-500 hover:underline">
          ← Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 flex-col">
          <div className="flex gap-2 flex-col">
            <label className="text-sm leading-none text-stone-600">
              Full Name (required)
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none"
              required
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="text-sm leading-none text-stone-600">
              Phone Number (required)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none"
              required
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="text-sm leading-none text-stone-600">
              House No./Building Name (required)
            </label>
            <input
              name="houseNo"
              value={formData.houseNo}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none"
              required
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="text-sm leading-none text-stone-600">
              Road Name/Area/Colony (required)
            </label>
            <input
              name="roadName"
              value={formData.roadName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none"
              required
            />
          </div>
          <div className="flex gap-2 flex-col">
            <label className="text-sm leading-none text-stone-600">
              Nearby Famous Place (optional)
            </label>
            <input
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg outline-none"
            />
          </div>
          <div className="flex gap-4 flex-col">
            <div className="flex gap-2 flex-col">
              <label className="text-sm leading-none text-stone-600">
                City (required)
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg outline-none"
                required
              />
            </div>
            <div className="flex gap-2 flex-col">
              <label className="text-sm leading-none text-stone-600">
                State (required)
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg outline-none"
                required
              />
            </div>
            <div className="flex gap-2 flex-col">
              <label className="text-sm leading-none text-stone-600">
                ZIP Code (required)
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg outline-none"
                required
              />
            </div>
          </div>
        </div>

        <h2 className="p-4 px-0 text-xl font-semibold">Payment Method</h2>

        <div className="flex gap-4 flex-col">
          {/* Cash on Delivery Option */}
          <label className="flex items-center space-x-4 p-2 px-4 border rounded-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={handleChange}
              className="h-5 w-5 text-stone-600 focus:ring-stone-500"
            />
            <div>
              <span className="block font-medium">Cash on Delivery</span>
              <span className="block text-sm text-stone-600">
                Pay when you receive your order
              </span>
            </div>
          </label>

          {/* Online Payment Options */}
          <label className="flex items-center space-x-4 p-2 px-4 border rounded-lg">
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={formData.paymentMethod === "upi"}
              onChange={handleChange}
              className="h-5 w-5 text-stone-600 focus:ring-stone-500"
            />
            <div>
              <span className="block font-medium">UPI Payment</span>
              <span className="block text-sm text-green-500 font-medium">
                Get ₹15 discount on this order
              </span>
              <span className="block text-sm text-stone-600">
                We'll collect payment after you place the order
              </span>
            </div>
          </label>
        </div>

        {/* Order Summary */}
        <div className="mt-2 p-4 px-0">
          <h2 className="text-xl font-semibold leading-none">Order Summary</h2>

          <div className="p-2 px-0 flex flex-col">
            <div className="flex justify-between">
              <span className="text-stone-600">Subtotal</span>
              <span>₹{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">Delivery Charges</span>
              <span className={deliveryCharge === 0 ? "text-green-500" : ""}>
                {deliveryCharge === 0
                  ? "FREE"
                  : `₹${formatCurrency(deliveryCharge)}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Applied Coupon</span>
                <span className="text-green-500">
                  -₹{formatCurrency(discount)}
                </span>
              </div>
            )}

            {onlineDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Additional Discount</span>
                <span className="text-green-500">
                  -₹{formatCurrency(onlineDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>₹{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-2.5 text-lg text-center rounded-lg block text-white bg-stone-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
