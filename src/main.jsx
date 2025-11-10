import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { ToastContainer } from "react-toastify";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="!z-[9999]"
      toastClassName="!bg-white !text-gray-900 !shadow-lg !border !border-gray-200"
      progressClassName="!bg-gradient-to-r !from-primary-500 !to-secondary-500"
    />
  </>
);