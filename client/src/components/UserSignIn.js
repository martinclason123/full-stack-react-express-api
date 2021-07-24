/*
	UserSignIn - This component provides the "Sign In" screen by rendering a form that allows a user to sign in using their existing account information. The component also renders a "Sign In" button that 
	when clicked signs in the user and a "Cancel" button that returns the user to the default route (i.e. the list of courses).
*/
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const UserSignIn = (props) => {
  const { context } = props;
  const [emailAddress, setEmailAddress] = useState();
  const [password, setPassword] = useState();
  const [errorsDiv, setErrorsDiv] = useState();

  const history = useHistory();

  const submit = (e) => {
    e.preventDefault();

    // saves the url from the redirected page
    const { from } = props.history.location.state || {
      from: { pathname: "/" },
    };

    try {
      context.actions.signIn(emailAddress, password).then((user) => {
        if (user === null) {
          setErrorsDiv(
            <div className="validation--errors">Sign in was unsuccessful</div>
          );
        } else {
          // brings the user back to the previous page after login
          history.push(from);
        }
      });
    } catch (error) {
      history.push("/error");
    }
  };

  return (
    <div className="form--centered">
      <h2>Sign In</h2>
      {errorsDiv}
      <form>
        <label for="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={emailAddress}
          onChange={(e) => {
            setEmailAddress(e.target.value);
          }}
        />
        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button
          class="button"
          type="submit"
          onClick={(e) => {
            submit(e);
          }}
        >
          Sign In
        </button>
        <a class="button button-secondary" href="/">
          Cancel
        </a>
      </form>
      <p>
        Don't have a user account? Click here to <a href="/signup">sign up</a>!
      </p>
    </div>
  );
};

export default UserSignIn;
