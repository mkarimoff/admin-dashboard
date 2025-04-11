import * as ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <>
    <BrowserRouter>
    <ToastContainer position="bottom-right" autoClose={2000} />
      <App />
    </BrowserRouter>
  </>
);