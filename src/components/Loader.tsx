import { IonContent, IonSpinner } from "@ionic/react";
import React from "react";
import "./Loader.css"
type Props = {};

const Loader = (props: Props) => {
  return (
    <IonContent class="content">
      <div className="loaderContainer">
        <IonSpinner class="loader" name="dots" slot="end"></IonSpinner>
      </div>
    </IonContent>
  );
};

export default Loader;
