import { Redirect, Slot, useSegments } from "expo-router";
import React from "react";


let __SESSION = false;
export const setSession = (v: boolean) => { __SESSION = v; };
export const getSession = () => __SESSION;

export default function RootLayout() {
  const segments = useSegments();              
  const authed = getSession();
  const first = segments[0];                    

  
  if (!authed) {
    if (first === "login") {
      return <Slot />;                          
    }
    return <Redirect href="/login" />;         
  }

  
  if (authed && first === "login") {
    return <Redirect href="/" />;
  }

  
  return <Slot />;
}
