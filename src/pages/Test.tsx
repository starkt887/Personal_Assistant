import React from 'react';
import { IonContent, IonInput, IonItem, IonList, IonPage } from '@ionic/react';
type Props = {}

const Test = (props: Props) => {
  return (
    <IonPage>
<IonContent class='ion-margin ion-padding' style={{marginBottom:"50px"}}>
<IonList>
    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Input with placeholder" placeholder="Enter company name"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Input with value" value="121 S Pinckney St #300"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Readonly input" value="Madison" readonly={true}></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Disabled input" value="53703" disabled={true}></IonInput>
    </IonItem>
    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Default input"></IonInput>
    </IonItem>

    <IonItem>
      <IonInput label="Last input"></IonInput>
    </IonItem>

  </IonList>
</IonContent>
    </IonPage>
   
  )
}

export default Test