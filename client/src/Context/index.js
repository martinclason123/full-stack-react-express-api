import React, { useState } from "react";
import Data from "../Data/Data";
import Cookies from "js-cookie";

export const CoursesContext = React.createContext();
const data = new Data();

export const Provider = (props) => {
  // put the authenticated user into state, and saves the data in a cookie
  const [authenticatedUser, setAuthenticatedUser] = useState(
    Cookies.getJSON("authenticatedUser") || null
  );
  const [userPassword, setUserPassword] = useState(
    Cookies.getJSON("userPassword") || null
  );

  // function to sign the user in and set the state/cookies
  const signIn = async (emailAddress, password) => {
    const user = await data.getUser(emailAddress, password);
    if (user !== null) {
      setAuthenticatedUser(user);
      setUserPassword(password);
      // Set cookies for user object and password
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
      Cookies.set("userPassword", password, { expires: 1 });
      return user;
    } else {
      return null;
    }
  };
  // Sets the authenticatedUser variable to null and removes the cookie
  const signOut = async () => {
    await setAuthenticatedUser(null);
    await setUserPassword(null);
    Cookies.remove("authenticatedUser");
    Cookies.remove("userPassword");
  };

  return (
    <CoursesContext.Provider
      value={{
        authenticatedUser,
        userPassword,
        data,
        actions: {
          signIn: signIn,
          signOut: signOut,
        },
      }}
    >
      {props.children}
    </CoursesContext.Provider>
  );
};

export const Consumer = CoursesContext.Consumer;

// Takes a component that is passed to it, wraps it in context, and returns it
export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <CoursesContext.Consumer>
        {(context) => <Component {...props} context={context} />}
      </CoursesContext.Consumer>
    );
  };
}
