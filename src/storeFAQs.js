import storeData from "./storeData";

const storeFAQS = [
  {
    question: "How do I use it?",
    answer:
      "You can use it like normal broom/wiper. No complicated setup required!",
  },
  {
    question: "How long does delivery take?",
    answer:
      "We ship all orders within 24 hours. Delivery usually takes 5-7 business days, depending on your location.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer: "Yes, COD is available at most pincodes across India.",
  },
  {
    question: "What if I don't like the product?",
    answer:
      "We offer a 7-day satisfaction guarantee. If you're not happy, reach out — we'll make it right.",
  },
  {
    question: "How can I contact support?",
    answer: `You can reach us anytime at ${storeData.EMAIL}, we usually reply within a few hours.`,
  },
];

export default storeFAQS;
