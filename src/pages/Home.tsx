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
  const [inputText, setInputText] = useState<string>();

  const sendMessage = async () => {
    if (inputText?.trim()) {
      setMessages([...messages, { text: inputText, sender: SENDER_TYPE.USER }]);
      setisLoading(true);
      let result = await sendPrompt(inputText);

      speak(result);
      setMessages((prev) => [
        ...prev,
        { text: result, sender: SENDER_TYPE.SYSTEM },
      ]);
      setTimeout(() => {
        setisSpeaking(true);
      }, 5000);
      stopSpeakingOnTime(result);

      // Add chatbot response logic here
      setInputText("");
    }
  };
  const stopSpeakingOnTime = (result: string) => {
    let wordCount = result.split(" ").length - 1;
    let resetSpeakingFlagMS = (wordCount / (2.5 * 1)) * 1000; //(wordCount/(tts words per second * speed)) * 1000
   console.log("TTS will stop in(sec):",resetSpeakingFlagMS/1000);
   
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
    stopSpeakingOnTime(text)
  };
  useEffect(() => {
    // let value = Math.random() * 1000;
    // console.log("added value");
    // setInputText(`Value - ${value}`);

    let lastElement = ionListRef.current?.lastElementChild;
    // console.log(lastElement?.getHTML());

    lastElement?.scrollIntoView({ behavior: "smooth" });
    // contentRef.current?.scrollToBottom(300)
  }, [messages]);

  useEffect(() => {
    console.log(ENV.VITE_GEMINI_API_KEY);
  }, []);

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
            <IonButton className="inputButton" onClick={sendMessage}>
              <IonIcon slot="icon-only" size="large" icon={send}></IonIcon>
            </IonButton>
          ) : (
            <IonButton className="inputButton" onClick={() => {}}>
              <IonIcon slot="icon-only" size="large" icon={mic}></IonIcon>
            </IonButton>
          )}
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Home;
