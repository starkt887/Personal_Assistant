import { ToastOptions, useIonToast } from "@ionic/react";

function useToast() {
  const [present] = useIonToast();

  const presentToast = (
    message: string,
    color: ToastOptions["color"],
    duration?: number,
    position?: ToastOptions["position"]
  ) => {
    present({
      message,
      duration: duration || 2000,
      color: color,
      position: position||"bottom",
    });
  };
  return { presentToast };
}
export default useToast;
