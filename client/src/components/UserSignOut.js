/*
This component signs out the user and returns the user to the courses page
*/
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

const UserSignOut = ({ context }) => {
  // component calls signOut and updates state after render
  useEffect(() => {
    try {
      context.actions.signOut();
    } catch (error) {
      <Redirect to="/error" />;
    }
  });

  return <Redirect to="/" />;
};

export default UserSignOut;
