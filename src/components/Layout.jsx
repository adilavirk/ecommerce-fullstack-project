import { Toaster } from "react-hot-toast";
import { GlobalState } from "../context/index";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <GlobalState>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#000",
            color: " #fff",
          },
        }}
      />
      {children}
    </GlobalState>
  );
};

export default Layout;
