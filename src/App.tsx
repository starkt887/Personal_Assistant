import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Test from "./pages/Test";
import LockScreen from "./pages/LockScreen";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loginSuccess } from "./features/authentication/authenticationSlice";
import Loader from "./components/Loader";

setupIonicReact();

const App: React.FC = () => {
  const { isLoggedin } = useAppSelector((state) => state.AuthenticationState);

console.log(isLoggedin);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {isLoggedin ? (
            <>
              <Route exact path="/home">
                <Home />
                {/* <Test/> */}
              </Route>
              <Route path="/">
                <Redirect to="/home" />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/lockscreen">
                <LockScreen />
                {/* <Test/> */}
              </Route>
              <Route path="/">
                <Redirect to="/lockscreen" />
              </Route>
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
