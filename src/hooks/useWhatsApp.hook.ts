import {
  ContactPayload,
  Contacts,
  GetContactResult,
} from "@capacitor-community/contacts";
import { App } from "@capacitor/app";
import { useEffect, useState } from "react";

function useWhatsApp() {
  const [contactList, setcontactList] = useState<ContactPayload[]>();
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await Contacts.checkPermissions();
      if (permission.contacts !== "granted") {
        await Contacts.requestPermissions();
      }
    };
    checkPermission();
  }, []);
  useEffect(() => {
    console.log("Contact list", contactList?.join(","));
    console.log(contactList);
    console.log(JSON.stringify(contactList));
  }, [contactList]);

  const getContactList = async () => {
    const list = await Contacts.getContacts({
      projection: { name: true, phones: true },
    });
    setcontactList(list.contacts);
    return list.contacts;
  };
  const searchContactByName = async (name: string) => {
    let allContacts = await getContactList();
    let contact = allContacts?.find((contact) => {
      console.log(
        "match:",
        name,
        "display",
        contact.name?.display?.toLowerCase()
      );
      return contact.name?.display?.toLowerCase().startsWith(name);
    });
    return contact;
  };
  //send a whatsapp hello! to krishna kumar
  const sendWhatsAppMessage = async (nameOrPhone: string, message: string) => {
    if (nameOrPhone && message) {
      let number = nameOrPhone;
      if (isNaN(parseInt(nameOrPhone))) {
        //then search the name in contacts
        let contact = await searchContactByName(nameOrPhone);
        console.log("contact found:", JSON.stringify(contact));
        if (contact && contact.phones && contact.phones.length > 0) {
          number = contact.phones[0].number ?? nameOrPhone;
        }
      }

      const url = `whatsapp://send?phone=${number}&text=${message}`;
      try {
        await window.open(url);
      } catch (error) {
        console.error("Error opening WhatsApp:", error);
      }
    }
    // const phoneNumber = "91XXXXXXXXXX";
    // const message = encodeURIComponent("Hello, I want to contact you!");
    // const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
  };
  return { sendWhatsAppMessage, searchContactByName };
}
export default useWhatsApp;
