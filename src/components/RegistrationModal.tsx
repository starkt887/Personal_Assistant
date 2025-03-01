import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognition.hook";
import { mic } from "ionicons/icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../services/firebaseClient";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginSuccess } from "../features/authentication/authenticationSlice";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { loadingOff, loadingOn } from "../features/loader/loaderSlice";
import Loader from "./Loader";
import useToast from "../hooks/useToast.hook";

type RegisterProps = {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
};

const RegistrationModal = ({ isOpen, setIsOpen }: RegisterProps) => {
  const {
    isListening,
    Transcript,
    resetTranscript,
    startListening,
    stopListening,
  } = useSpeechRecognition();
  const [Name, setName] = useState<string>("");
  const [Email, setEmail] = useState<string>("");
  const [Password, setPassword] = useState<string>("");
  const [ConfirmPassword, setConfirmPassword] = useState<string>("");
  const [UnloackPhrase, setUnloackPhrase] = useState<string>("");
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.LoaderState.loading);
  const { presentToast } = useToast();

  const validateFields = () => {
    let isValid = true;
    const isFilled = [
      Name,
      Email,
      Password,
      ConfirmPassword,
      UnloackPhrase,
    ].every((input) => input !== "");
    if (!isFilled) {
      presentToast("Please enter all fields!", "danger");
      return false;
    }
    if (!Email.includes("@") || !Email.includes(".")) {
      presentToast("Please enter valid email!", "danger");
      return false;
    }
    if (Password !== ConfirmPassword) {
      presentToast("Passwords doesn't match!", "danger");
      return false;
    }
    console.log(isValid);

    return true;
  };
  const resetInputs = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUnloackPhrase("");
  };
  const closeModal = () => {
    resetInputs();
    setIsOpen(false);
  };
  const handleRegister = () => {
    console.log(Name, Email, Password, ConfirmPassword, UnloackPhrase);

    if (validateFields()) {
      dispatch(loadingOn());
      createUserWithEmailAndPassword(auth, Email!, Password!)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;
          const docRef = doc(fireStore, "users", user.uid);
          await setDoc(docRef, {
            email: Email,
            name: Name,
            unlock_phrase: UnloackPhrase,
          });
          localStorage.setItem("unlock_phrase", UnloackPhrase);
          dispatch(loadingOff());
          closeModal();
          presentToast("Registration Success! Please Login", "success");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Registration Error:", errorCode, errorMessage);
          // ..
          dispatch(loadingOff());
          presentToast("Registration Failed, Try again!", "danger");
        });
    }
  };
  useEffect(() => {
    if (Transcript) {
      setUnloackPhrase(Transcript);
      resetTranscript();
    }
  }, [Transcript]);
  // useEffect(() => {
  //  console.log(UnloackPhrase);

  // }, [UnloackPhrase])

  return (
    <IonModal isOpen={isOpen} trigger="open-modal">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={closeModal}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="content">
            <IonList lines="none">
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Name"
                  labelPlacement="floating"
                  placeholder="Name"
                  type="text"
                  onIonInput={(e) => setName(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Email"
                  labelPlacement="floating"
                  placeholder="Email"
                  type="email"
                  onIonInput={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  placeholder="Password"
                  type="password"
                  onIonInput={(e) => setPassword(e.detail.value!)}
                >
                  {" "}
                </IonInput>
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Confirm Password"
                  labelPlacement="floating"
                  placeholder="Confirm Password"
                  type="password"
                  onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                >
                  {" "}
                </IonInput>
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Unlock Phrase"
                  labelPlacement="floating"
                  placeholder="Unlock Phrase"
                  type="text"
                  onIonInput={(e) => setUnloackPhrase(e.detail.value!)}
                >
                  {" "}
                </IonInput>
                <IonButton
                  slot="end"
                  expand="full"
                  onClick={() => startListening()}
                >
                  <IonIcon icon={mic} />
                </IonButton>
              </IonItem>

              <IonButton
                className="btnlogin"
                expand="full"
                onClick={handleRegister}
              >
                Register
              </IonButton>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default RegistrationModal;
