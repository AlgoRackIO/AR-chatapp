import React, { Fragment } from "react";
import NavContainer from "./android/app/src/navigation";
import Loader from "./android/app/src/components/loader";
import { StoreProvider } from "./android/app/src/context/store";
import { StatusBar } from "react-native";


const App = () => {
  return (
    <StoreProvider>
      <StatusBar barStyle="light-content" />
      <NavContainer />
      <Loader />
    </StoreProvider>
  );
};

export default App;