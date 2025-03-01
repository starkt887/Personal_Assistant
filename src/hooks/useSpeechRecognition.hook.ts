import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { useEffect, useState } from "react";

function useSpeechRecognition() {
  const [isListening, setisListening] = useState(false);
  const [Transcript, setTranscript] = useState<string>();
  useEffect(() => {
    const checkPermission = async () => {
      const permission = await SpeechRecognition.checkPermissions();
      if (permission.speechRecognition !== "granted") {
        await SpeechRecognition.requestPermissions();
      }
      //   if (permission.speechRecognition !== "denied") {
      //     await SpeechRecognition.requestPermissions();
      //   }
    };
    checkPermission();
  }, []);
  SpeechRecognition.addListener("partialResults", (result) => {
    console.log("startListening:prevalid:", result.matches[0]);
    if (result.matches) {
    //   setTranscript(result.matches[0]);
      console.log("startListening:Spoke:", result.matches[0]);
    }
    SpeechRecognition.removeAllListeners();
  });
  const startListening = async () => {
    try {
      setisListening(true);
      let results = await SpeechRecognition.start({
        language: "en-US",
        maxResults: 1,
        prompt: "Speak now...",
        partialResults: false,
        popup: true,
      });
      if (results.matches) {
        setTranscript(results.matches[0].toLowerCase());
        console.log("startListening:Spoke Direct:", results.matches[0]);
      }
      stopListening();
    } catch (error) {
      console.log("startListening:error:", error);
      stopListening();
      //   setisListening(false);
    }
  };

  const stopListening = async () => {
    setisListening(false);
    if (await SpeechRecognition.isListening()) {
      SpeechRecognition.stop();
    }
  };
  const resetTranscript = async () => {
    setTranscript("");
  };
  return {
    startListening,
    stopListening,
    resetTranscript,
    isListening,
    Transcript,
  };
}

export default useSpeechRecognition;
