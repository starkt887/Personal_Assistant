import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import "./Home.css";
import { useEffect, useRef, useState } from "react";
import { send, mic, stop, play } from "ionicons/icons";
import { speak, stopSpeech } from "../utils/tts";
import { ENV } from "../utils/env";
import { sendPrompt } from "../services/geminiClient";
import useSpeechRecognition from "../hooks/useSpeechRecognition.hook";
import { Keyboard } from "@capacitor/keyboard";
import useWhatsApp from "../hooks/useWhatsApp.hook";
import {
  extractWhatsAppMsgAndPhone,
  isWhatsAppCommand,
} from "../utils/whatsApp";
import { IWhatsAppModal } from "../modals";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseClient";
import useToast from "../hooks/useToast.hook";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/authentication/authenticationSlice";
import { useHistory } from "react-router";

enum SENDER_TYPE {
  SYSTEM = "system",
  USER = "user",
}

const Home: React.FC = () => {
  const ionListRef = useRef<HTMLIonListElement>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [isLoading, setisLoading] = useState(false);
  const [isSpeaking, setisSpeaking] = useState(false);
  const [messages, setMessages] = useState<
    { text: string; sender: SENDER_TYPE }[]
  >([]);
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const {
    isListening,
    startListening,
    stopListening,
    Transcript,
    resetTranscript,
  } = useSpeechRecognition();
  const { sendWhatsAppMessage, searchContactByName } = useWhatsApp();
  const {presentToast}=useToast()
  const dispatch=useAppDispatch()
  const history=useHistory()

  const [isWhatsAppRoutineRoutine, setisWhatsAppRoutineRoutine] = useState<{
    enabled: boolean;
    nameOrPhone: string | null;
    message: string | null;
  }>({
    enabled: false,
    nameOrPhone: null,
    message: null,
  });
  const resetWhatsAppRoutine = () => {
    setisWhatsAppRoutineRoutine({
      enabled: false,
      nameOrPhone: null,
      message: null,
    });
  };
  const checkIfContactExists = async (result: IWhatsAppModal) => {
    if (result.nameOrPhone) {
      if (isNaN(parseInt(result.nameOrPhone))) {
        let searchContactResult = await searchContactByName(result.nameOrPhone);
        if (!searchContactResult) {
          //stop here
          generatePromptResult(null, "Contact not found!", false);
          resetWhatsAppRoutine();
          return false;
        }
        return true;
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log("WA routine:", JSON.stringify(isWhatsAppRoutineRoutine));
  }, [isWhatsAppRoutineRoutine]);

  const checkWhatsAppRoutine = async (prompt: string) => {
    let result: IWhatsAppModal = { nameOrPhone: null, message: null };
    if (!isWhatsAppRoutineRoutine.enabled) {
      result = extractWhatsAppMsgAndPhone(prompt);
      if (result.message === "0" && result.nameOrPhone === "0") return;
    } else {
      result.message = isWhatsAppRoutineRoutine.message;
      result.nameOrPhone = isWhatsAppRoutineRoutine.nameOrPhone;
    }
    console.log("Result", JSON.stringify(result));

    if (result.message && result.nameOrPhone) {
      console.log("Routine 1 Direct call", JSON.stringify(result));

      //direct call
      setisWhatsAppRoutineRoutine({
        enabled: true,
        nameOrPhone: result.nameOrPhone,
        message: result.message,
      });
      //check if the name exists or is it a number
      if (await checkIfContactExists(result))
        sendWhatsAppMessage(result.nameOrPhone, result.message);
      resetWhatsAppRoutine();
    } else if (!result.message) {
      console.log("Routine 3 Direct call", JSON.stringify(result));
      //ask for nameOrPhone and message one by one
      if (
        isWhatsAppRoutineRoutine.enabled &&
        isWhatsAppRoutineRoutine.nameOrPhone
      ) {
        setisWhatsAppRoutineRoutine({
          enabled: true,
          nameOrPhone: result.nameOrPhone,
          message: prompt,
        });
        resetWhatsAppRoutine();
        generatePromptResult(null, "Sending the message now!", false);
        sendWhatsAppMessage(isWhatsAppRoutineRoutine.nameOrPhone, prompt);
        return;
      }
      if (isWhatsAppRoutineRoutine.enabled) {
        setisWhatsAppRoutineRoutine({
          enabled: true,
          nameOrPhone: prompt,
          message: result.message,
        });
        //check if the name exists or is it a number
        if (
          await checkIfContactExists({
            message: result.message,
            nameOrPhone: prompt,
          })
        )
          generatePromptResult(
            null,
            "What message do you want to send!",
            false
          );

        return;
      }
      generatePromptResult(null, "Who do you want to send message!", false);
      setisWhatsAppRoutineRoutine({
        enabled: true,
        nameOrPhone: null,
        message: null,
      });
    }
  };
  const checkLogout = (inputPrompt: string) => {
    if (inputPrompt === "logout" || inputPrompt === "sign out") {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          presentToast("Logged out!","success")
          dispatch(logout())
          history.replace("/")
        })
        .catch((error) => {
          // An error happened.
          presentToast("Unable to logout!","danger")
        });
    }
  };
  const sendMessage = async (speechResult?: string) => {
    console.log("speechResult:", speechResult);
    let inputPrompt = speechResult ?? inputText;
    console.log("inputPrompt:", inputPrompt);
    checkWhatsAppRoutine(inputPrompt!);
    if (inputPrompt?.trim()) {
      setMessages((prev) => [
        ...prev,
        { text: inputPrompt, sender: SENDER_TYPE.USER },
      ]);
      if (
        !isWhatsAppCommand(inputPrompt) &&
        !isWhatsAppRoutineRoutine.enabled
      ) {
        checkLogout(inputPrompt!);
        generatePromptResult(inputPrompt);
        
      }
    }
  };
  const generatePromptResult = async (
    inputPrompt: string | null,
    respondThis?: string,
    gemini: boolean = true
  ) => {
    setisLoading(true);
    let result = respondThis!; //default result to be sent by calling function if gemini is sent false
    if (gemini && inputPrompt) {
      result = await sendPrompt(inputPrompt);
    }
    console.log("respondThis:", result);

    speak(result);
    setisSpeaking(true);
    setMessages((prev) => [
      ...prev,
      { text: result, sender: SENDER_TYPE.SYSTEM },
    ]);
    stopSpeakingOnTime(result);

    // Add chatbot response logic here
    resetTranscript();
    setInputText(undefined);
  };
  const stopSpeakingOnTime = (result: string) => {
    let wordCount = result.split(" ").length - 1;
    let resetSpeakingFlagMS = (wordCount / (2.5 * 1)) * 1000; //(wordCount/(tts words per second * speed)) * 1000
    console.log("TTS will stop in(sec):", resetSpeakingFlagMS / 1000);

    setTimeout(() => onStopTTSClick(), resetSpeakingFlagMS);
  };
  const onStopTTSClick = () => {
    setisSpeaking(false);
    setisLoading(false);
    // stopSpeech();
  };
  const onPlayClick = (text: string) => {
    stopSpeech();
    speak(text);
    setisSpeaking(true);
    stopSpeakingOnTime(text);
  };
  useEffect(() => {
    // let value = Math.random() * 1000;
    // console.log("added value");
    // setInputText(`Value - ${value}`);

    let lastElement = ionListRef.current?.lastElementChild;
    // console.log(lastElement?.getHTML());

    lastElement?.scrollIntoView({ behavior: "smooth" });
    // contentRef.current?.scrollToBottom(300)
    console.log("System response:", messages[messages.length - 1]);
  }, [messages]);

  useEffect(() => {
    console.log(ENV.VITE_GEMINI_API_KEY);
  }, []);
  useEffect(() => {
    console.log("startListening:effect 1");

    if (!isListening) {
      console.log("startListening:effect 2");

      if (Transcript) {
        console.log("startListening:effect 3");

        sendMessage(Transcript);
      }
    }
  }, [isListening]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chatbot</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} class="home">
        {/* <div style={{ height: "85vh", overflowY: "scroll" }}> */}
        <IonList ref={ionListRef} class="chatlist">
          {messages.map((msg, index) => (
            <div key={index}>
              {" "}
              <IonItem id={`${msg.text}`}>
                <IonText
                  slot={msg.sender === SENDER_TYPE.SYSTEM ? "end" : "start"}
                  class="ion-text-justify"
                >
                  {" "}
                  <p>{msg.text}</p>
                </IonText>
              </IonItem>{" "}
              {msg.sender === SENDER_TYPE.SYSTEM && (
                <IonItem id={`${msg.text}`} key={index}>
                  {isSpeaking ? (
                    <IonButton
                      className="stopButton"
                      color="dark"
                      slot="end"
                      onClick={() => onStopTTSClick()}
                    >
                      <IonIcon
                        slot="icon-only"
                        size="small"
                        icon={stop}
                      ></IonIcon>
                    </IonButton>
                  ) : (
                    <IonButton
                      className="stopButton"
                      color="dark"
                      slot="end"
                      onClick={() => onPlayClick(msg.text)}
                    >
                      <IonIcon
                        slot="icon-only"
                        size="small"
                        icon={play}
                      ></IonIcon>
                    </IonButton>
                  )}
                </IonItem>
              )}
            </div>
          ))}
          {/* <IonItem>
            <IonText class="ion-text-justify">
              {" "}
              <p>Hello there</p>
            </IonText>
          </IonItem>{" "} */}
        </IonList>
        {/* </div> */}
        {}
        {isLoading && (
          <IonItem className="loader">
            <IonSpinner class="dots" name="dots" slot="end"></IonSpinner>
            {isSpeaking && (
              <IonButton
                className="stopButton"
                color="dark"
                slot="end"
                onClick={onStopTTSClick}
              >
                <IonIcon slot="icon-only" size="large" icon={stop}></IonIcon>
              </IonButton>
            )}
          </IonItem>
        )}

        <IonItem className="inputPanel">
          <IonInput
            value={inputText}
            onChange={(e) => setInputText(e.currentTarget.value?.toString()!)}
            onIonInput={(e) => setInputText(e.target.value!.toString())}
            placeholder="Type a message"
          />
          {inputText ? (
            <IonButton className="inputButton" onClick={() => sendMessage()}>
              <IonIcon slot="icon-only" size="large" icon={send}></IonIcon>
            </IonButton>
          ) : (
            <IonButton
              className="inputButton"
              onClick={() => {
                startListening();
              }}
            >
              <IonIcon slot="icon-only" size="large" icon={mic}></IonIcon>
            </IonButton>
          )}
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Home;
  // else if (!result.message && result.nameOrPhone) {
  //   console.log("Routine 2 Direct call", JSON.stringify(result));
  //   //ask what should be the message
  //   if (
  //     isWhatsAppRoutineRoutine.enabled &&
  //     isWhatsAppRoutineRoutine.message
  //   ) {
  //     setisWhatsAppRoutineRoutine({
  //       enabled: true,
  //       nameOrPhone: result.nameOrPhone,
  //       message: prompt,
  //     });
  //     generatePromptResult(null, "Sending the message now!", false);
  //     //check if the name exists or is it a number
  //     if (await checkIfContactExists(result))
  //       sendWhatsAppMessage(result.nameOrPhone, prompt);
  //     resetWhatsAppRoutine();
  //     return;
  //   }
  //   setisWhatsAppRoutineRoutine({
  //     enabled: true,
  //     nameOrPhone: result.nameOrPhone,
  //     message: result.message,
  //   });
  //   generatePromptResult(null, "What message do you want to send!", false);
  // }