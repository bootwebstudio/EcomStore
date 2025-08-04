import storeData from "../storeData";

export const sendToTelegram = async (message) => {
  const botToken = storeData.BOT_TOKEN;
  const chatId = storeData.CHAT_ID;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send message to Telegram");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    throw error;
  }
};
