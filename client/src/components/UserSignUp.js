/*

This component provides the "Sign Up" screen by rendering a form that allows a user to sign up by creating a new account. 
The component also renders a "Sign Up" button that when clicked sends a POST request to the REST API's /api/users route 
and signs in the user. This component also renders a "Cancel" button that returns the user to the default route (i.e. the list of courses).

*/
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

const UserSignUp = ({ context }) => {
  let history = useHistory();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [emailAddress, setEmailAddress] = useState();
  const [password, setPassword] = useState();
  const [confirmedPassword, setConfirmedPassword] = useState();
  // holds any errors JSX collected by the validation in the handleSubmit function
  const [formErrors, setFormErrors] = useState();

  // an array to hold all validation errors
  let errorsArray = [];

  // variable to hold validation errors. Is set by the handleSubmit function
  let errorsJSX;

  // an array holding state, allowing for easy validation
  let formData = [
    { firstName, error: "First name is required" },
    { lastName, error: "Last name is required" },
    { emailAddress, error: "Email address is required" },
    { password, error: "Password is required" },
    { confirmedPassword, error: "Please confirm password" },
  ];

  // Checks for errors and adds them to state
  const validationErrors = () => {
    // if errors are present, they are put into state and rendered
    if (errorsArray.length > 0) {
      errorsJSX = errorsArray.map((val) => {
        return <li>{val}</li>;
      });
      // JSX that will show the errors list items
      let errorsDiv = (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>{errorsJSX}</ul>
        </div>
      );
      // errors are put into state to be rendered
      setFormErrors(errorsDiv);
    }
  };

  // Prevents default form action and performs validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    // resets the array with every submission attempt
    errorsArray = [];
    // checks for empty fields
    formData.map((input) => {
      validateData(input, input.error);
    });
    // checks for matching passwords
    if (password !== confirmedPassword) {
      errorsArray.push("Passwords do not match");
    }

    if (errorsArray.length === 0) {
      // If no validation errors are present, the form data is sent to the API to create a new user
      try {
        context.data
          .createUser({
            firstName,
            lastName,
            emailAddress,
            password,
          })
          .then(async (response) => {
            // a null response is expected, meaning user has been created
            if (response === null) {
              // send user to signin page
              history.push("/signin");
            } else {
              // add any errors sent back as a response to the errorsArray and add them to state
              response.errors.map((error) => {
                errorsArray.push(error);
              });
              validationErrors();
            }
          });
      } catch (error) {
        console.log(error);
        history.push("/error");
      }
    } else {
      validationErrors();
    }
  };

  // Takes an object and an error message, if any part of the object is undefined or an empty string, an error is pushed to an array
  const validateData = (input, inputError) => {
    for (let key in input) {
      if (!input[key] || input[key] === "") {
        errorsArray.push(inputError);
      }
    }
  };

  return (
    <div class="form--centered">
      <h2>Sign Up</h2>
      {formErrors}
      <form>
        <React.Fragment>
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />

          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
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
          />
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmedPassword}
            onChange={(e) => {
              setConfirmedPassword(e.target.value);
            }}
          />
          <button
            class="button"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Sign Up
          </button>
          <a class="button button-secondary" href={"/"}>
            Cancel
          </a>
        </React.Fragment>
      </form>

      <p>
        Already have a user account? Click here to <a href="/signin">sign in</a>
        !
      </p>
    </div>
  );
};

export default UserSignUp;
