import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonPage,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { lockClosed, lockOpen, person, mic, arrowBack } from "ionicons/icons";
import useSpeechRecognition from "../hooks/useSpeechRecognition.hook";
import "./LockScreen.css";
import { loginSuccess } from "../features/authentication/authenticationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useHistory } from "react-router";
import RegistrationModal from "../components/RegistrationModal";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../services/firebaseClient";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Loader from "../components/Loader";
import { loadingOff, loadingOn } from "../features/loader/loaderSlice";
import useToast from "../hooks/useToast.hook";
import { speak } from "../utils/tts";

type Props = {};

const LockScreen = (props: Props) => {
  const {
    isListening,
    Transcript,
    resetTranscript,
    startListening,
    stopListening,
  } = useSpeechRecognition();
  const [loginWithUP, setloginWithUP] = useState(false);
  const [Email, setEmail] = useState<string>();
  const [Password, setPassword] = useState<string>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [isRegistrationModalOpen, setisRegistrationModalOpen] = useState(false);
  const isLoading = useAppSelector((state) => state.LoaderState.loading);
  const { presentToast } = useToast();

  const handleLogin = () => {
    if (Email && Password) {
      dispatch(loadingOn());
      signInWithEmailAndPassword(auth, Email, Password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;

          const docSnap = await getDoc(doc(fireStore, "users", user.uid));
          if (docSnap.exists()) {
            presentToast("Login success!", "success");
            dispatch(
              loginSuccess({
                email: docSnap.get("email"),
                name: docSnap.get("name"),
                uid: user.uid,
              })
            );
            console.log("saving up",docSnap.get("unlock_phrase"));
            
            localStorage.setItem("unlock_phrase", docSnap.get("unlock_phrase"));
            history.replace("/home");
            dispatch(loadingOff());
          }

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Login Error:", errorCode, errorMessage);
          presentToast("Wrong username or password!", "danger");
          dispatch(loadingOff());
          // ..
        });
    }
  };
  useEffect(() => {
    const loginWithPhrase = async () => {
      if (Transcript) {
       
        let unlock_phrase = localStorage.getItem("unlock_phrase");
        console.log("Getting up",unlock_phrase);
        
        if (unlock_phrase) {
          if (unlock_phrase === Transcript) {
            dispatch(
              loginSuccess({
                email: "",
                name: "",
                uid: "",
              })
            );
            presentToast( "Login success!","success")
            speak(
              "Welcome, I am online!"
            );
            history.replace("/home");
          }else
          {
            presentToast( "Wrong Unlock Phrase, Please try again!","danger")
            speak(
              "Wrong Unlock Phrase, Please try again!"
            );
          }
        } else {
         presentToast("Unlock phrase is compromized, please sign in with email and password","warning")
          speak(
            "Unlock phrase is compromized! please sign in with email and password"
          );
        }

        resetTranscript();
      }
    };

    loginWithPhrase();
  }, [Transcript]);
  return (
    <IonPage className="lockscreen">
      <IonContent class="ion-padding">
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          setIsOpen={setisRegistrationModalOpen}
        />
        {isLoading ? (
          <Loader />
        ) : loginWithUP ? (
          <div className="content">
            <IonList lines="none">
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Email"
                  labelPlacement="floating"
                  placeholder="Email"
                  type="email"
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  placeholder="Password"
                  type="password"
                  onIonChange={(e) => setPassword(e.detail.value!)}
                >
                  {" "}
                </IonInput>
              </IonItem>
              <div className="loginButtonPanel">
                <IonButton expand="full" onClick={() => setloginWithUP(false)}>
                  <IonIcon icon={arrowBack} />
                </IonButton>
                <IonButton
                  className="btnlogin"
                  expand="full"
                  onClick={handleLogin}
                >
                  Login
                </IonButton>
              </div>
              <IonButton
                className="btnlogin"
                expand="full"
                onClick={() => setisRegistrationModalOpen(true)}
              >
                Register
              </IonButton>
            </IonList>
          </div>
        ) : (
          <IonFab slot="fixed" vertical="center" horizontal="center">
            <IonFabButton>
              <IonIcon icon={lockClosed}></IonIcon>
            </IonFabButton>
            <IonFabList side="bottom">
              <IonFabButton color="primary" onClick={startListening}>
                <IonIcon icon={mic}></IonIcon>
              </IonFabButton>
              <IonFabButton
                color="tertiary"
                onClick={() => setloginWithUP(true)}
              >
                <IonIcon icon={person}></IonIcon>
              </IonFabButton>
            </IonFabList>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LockScreen;

// <IonInput
// placeholder="Enter Unlock Phrase"
// onIonChange={(e) => setUnlockPhrase(e.detail.value!)}
// />
