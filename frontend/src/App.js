import React from "react";
import CommunityPage from "./Components/CommunityPage";
import Auth from "./Components/Auth";
import { Provider } from "react-redux";
import appStore from "./Utils/appStore";
import Body from "./Components/Body";
import GenerateImage from "./Components/GenerateImage"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const App = () => {

  const appRoute = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <CommunityPage />,
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/generate",
          element: <GenerateImage />,
        },
      ],
    },
  ]);

  return (
    <Provider store={appStore}>
      <>
        <RouterProvider router={appRoute} />
      </>
    </Provider>
  );
};

export default App;
