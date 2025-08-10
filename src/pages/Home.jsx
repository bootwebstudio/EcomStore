import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

// Icons
import { FiChevronDown } from "react-icons/fi";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Assets
import Image1 from "../assets/Image1.png";
import Image2 from "../assets/Image2.png";
import Image3 from "../assets/Image3.png";
import Image4 from "../assets/Image4.png";
import Sample from "../assets/Sample.mp4";

// Data
import storeData from "../storeData";
import storeFAQs from "../storeFAQs";
import storeReviews from "../storeReviews";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const intervalRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const productImages = [Image1, Image2, Image3, Image4];

  const startAutoRotation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoRotation();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    clearInterval(intervalRef.current);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;

    if (Math.abs(touchStartX - e.touches[0].clientX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      } else {
        setCurrentImageIndex(
          (prev) => (prev - 1 + productImages.length) % productImages.length
        );
      }
    }

    setTouchStartX(null);
    startAutoRotation();
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    startAutoRotation();
  };

  const { addToCart, isInCart, cartCount } = useCart();

  const product = {
    id: 1,
    name: storeData.NAME,
    price: storeData.PRICE,
    originalPrice: storeData.ORIGINAL_PRICE,
    image: Image1,
  };

  const handleAddToCart = () => addToCart(product);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setFullscreenImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="w-full h-full font-[Poppins] text-stone-800">
      {/* Resposiveness Alert */}
      <div className="text-center hidden sm:flex fixed inset-0 z-50 flex-col items-center justify-center bg-white">
        <i className="ri-smartphone-line text-6xl mb-4 text-stone-600"></i>
        <h1 className="text-2xl font-bold mb-2">Mobile Only Website</h1>
        <p className="text-lg max-w-md">
          This website is designed for mobile devices only. Please open it on
          your smartphone.
        </p>
      </div>

      {/* Offers */}
      <div className="w-full p-4 px-0 overflow-hidden bg-stone-800 text-white">
        <div className="whitespace-nowrap flex animate-scroll">
          <span className="px-2">
            Use code <b>DISCOUNT15</b> to get 15% off.
          </span>
          <span className="px-2">
            Use code <b>DISCOUNT15</b> to get 15% off.
          </span>
          <span className="px-2">
            Use code <b>DISCOUNT15</b> to get 15% off.
          </span>
          <span className="px-2">
            Use code <b>DISCOUNT15</b> to get 15% off.
          </span>
        </div>
      </div>

      <Navbar />

      {/* Product */}
      <div className="w-full p-4 flex gap-4 flex-col">
        {/* Main swipeable image */}
        <div
          className="w-full h-[50vh] rounded-lg overflow-hidden relative select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={productImages[currentImageIndex]}
            alt={`Product ${currentImageIndex + 1}`}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>

        {/* Static thumbnail row (no scrolling) */}
        <div className="w-full grid grid-cols-4 gap-2">
          {productImages.map((img, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${
                currentImageIndex === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Details */}
        <h2 className="pt-2 text-xl font-bold leading-none">{product.name}</h2>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <span className="text-lg leading-none">₹{storeData.PRICE}</span>
            <span className="line-through leading-none">
              ₹{storeData.ORIGINAL_PRICE}
            </span>
            <span className="font-semibold leading-none text-green-600">
              (
              {Math.round(
                ((storeData.ORIGINAL_PRICE - storeData.PRICE) /
                  storeData.ORIGINAL_PRICE) *
                  100
              )}
              % discount)
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <span>
              {storeData.RATING} <i className="ri-star-fill text-amber-400"></i>{" "}
              ({storeData.REVIEWS})
            </span>
          </div>
        </div>

        {isInCart(product.id) ? (
          <Link
            to="/cart"
            className="w-full p-2.5 text-lg rounded-lg text-white bg-stone-800 text-center block"
          >
            View Cart ({cartCount})
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full p-2.5 text-lg rounded-lg text-white bg-stone-800"
          >
            Add to Cart
          </button>
        )}

        <div className="pt-4 flex gap-4 flex-col">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl font-bold leading-none">Description</h2>
            <p>{storeData.DESCRIPTION}</p>
          </div>

          <div className="flex gap-2 flex-col">
            <h2 className="text-xl font-bold leading-none">Benefits</h2>
            <ul className="px-4 list-disc">
              <li>{storeData.BENEFITS[0]}</li>
              <li>{storeData.BENEFITS[1]}</li>
              <li>{storeData.BENEFITS[2]}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Sample */}
      <div className="w-full p-4 flex gap-4 flex-col">
        <video
          src={Sample}
          className="w-full h-[60vh] rounded-lg object-cover bg-zinc-200"
          muted
          loop
          autoPlay
        ></video>
      </div>

      {/* Product Reviews */}
      <div className="w-full p-4 flex gap-4 flex-col">
        <h2 className="text-xl font-bold leading-none">
          Customer Ratings & Reviews
        </h2>

        {storeReviews.map((review, index) => (
          <div
            key={index}
            className="w-full flex flex-col gap-2 border-b-2 pb-4"
          >
            <div className="flex items-center gap-2">
              <span className="p-0.5 px-2 rounded-full text-white bg-green-600 text-sm flex items-center gap-1.5">
                {review.rating} <i className="ri-star-fill text-xs"></i>
              </span>
              <span className="font-semibold">{review.service}</span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <p className="w-full text-stone-600">{review.review}</p>
              <img
                src={review.image}
                alt="customer"
                onClick={() => setFullscreenImage(review.image)}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
              />

              {fullscreenImage && (
                <div
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setFullscreenImage(null)}
                >
                  <img
                    src={fullscreenImage}
                    alt="Fullscreen"
                    className="max-w-full max-h-full"
                  />
                  <button
                    onClick={() => setFullscreenImage(null)}
                    className="text-2xl absolute top-4 right-4 text-white"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product FAQs */}
      <div className="w-full p-4 flex gap-4 flex-col">
        <h2 className="text-xl font-bold leading-none">Common Questions</h2>

        <div className="flex gap-4 flex-col">
          {storeFAQs.map((faq, index) => (
            <div key={index} className="border-2 rounded-xl transition">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span>{faq.question}</span>
                <FiChevronDown
                  className={`text-lg transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out text-stone-600 ${
                  openIndex === index
                    ? "max-h-40 opacity-100 pb-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
