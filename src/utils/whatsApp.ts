import { IWhatsAppModal } from "../modals";

export const isWhatsAppCommand = (
    prompt: string
  ): boolean => {
    let command = prompt.toLowerCase();
    if (command.includes("whatsapp")) {
      return true
    }
    return false;
  };
export const extractWhatsAppMsgAndPhone = (
  prompt: string
): IWhatsAppModal => {
  let command = prompt.toLowerCase();
  if (command.includes("whatsapp")) {
    const regex =
      /^send a whatsapp(?: message(?: (.+?))?)?(?: to ([\w\s\d]+))?$/i;
    const match = prompt.match(regex);
console.log(match);

    if (match) {
      return {
        message: match[1] ? match[1].trim() : null, // Extracted message
        nameOrPhone: match[2] ? match[2].trim() : null, // Extracted name/number
      };
    }
  }
  return { nameOrPhone: "0", message: "0" };
};

extractWhatsAppMsgAndPhone("send a whatsapp message")
