import { useToast } from "vue-toastification";

export default function useHandlerMessage() {
  const toast = useToast();
  return {
    displayError: (message) => {
      toast.error(message, {
        timeout: 5000,
        closeOnClick: false,
        pauseOnFocusLoss: true,
        pauseOnHover: false,
        draggable: false,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false,
      });
    },
    displayMessage: (message) => {
      toast.success(message);
    },
  };
}
