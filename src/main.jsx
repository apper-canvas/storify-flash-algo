import "@/index.css";
import "@/index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "@/router";
import { store } from "@/store";
import React from "react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
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
  </Provider>
);