import { hashHistory } from "react-router";
import Alert from 'react-s-alert';

export default function handleError(msg,code) {
  Alert.error(msg);
  switch (code) {
    case "B101":
      localStorage.setItem("userToken", "");
      hashHistory.push("login");
      break;
    case "B102":
      hashHistory.push("login");
      break;
    default:
      break;
  }
}
