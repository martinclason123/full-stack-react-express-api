import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// This component collects form data as the end user types, and submits the data to Data/data.js createCourse function,
// which sends the data to the API
const CreateCourse = ({ context }) => {
  // allows a redirect to the home page after a new course is created
  const history = useHistory();

  // stateful object to hold the form data as it is typed. Will be submitted to the API on form submission
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
    userId: context.authenticatedUser.id,
  });
  // holds any errors JSX collected by the validation in the handleSubmit function
  const [formErrors, setFormErrors] = useState();

  // function that puts the input field data into state as the end user types
  const setCourseFormData = (properties) => {
    setFormData({
      ...formData,
      ...properties,
    });
  };
  // variable to hold validation errors. Is set by the handleSubmit function
  let errorsJSX;
  let errorsArray = [];

  const validationErrors = async () => {
    errorsJSX = await errorsArray.map((val, index) => {
      return <li key={index}>{val}</li>;
    });
    // JSX that will for the errors list items
    let errorsDiv = (
      <div className="validation--errors">
        <h3>Validation Errors</h3>
        <ul>{errorsJSX}</ul>
      </div>
    );
    // errors are put into state to be rendered in the return statement
    await setFormErrors(errorsDiv);
  };

  // Handles the form submit, prevents the default, and sends the collected form data to the API
  const handleSubmit = async (e) => {
    // prevents the default submit action so the API can be called instead
    e.preventDefault();
    // array to store validation errors if present
    errorsArray = [];

    // The course is created VIA the createCourse function in context. Any error will result in the error page being displayed
    try {
      let response = await context.data.createCourse(
        formData,
        context.authenticatedUser.emailAddress,
        context.userPassword
      );

      if (response === null) {
        //success
        history.push("/"); // goes back to courses view
      } else {
        // add any errors sent back as a response to the errorsArray and add them to state
        response.errors.map((error) => {
          errorsArray.push(error);
          return null;
        });
        validationErrors();
      }
    } catch (error) {
      history.push("/error");
    }
  };

  return (
    <div className="wrap">
      <h2>Create Course</h2>
      {formErrors}
      <form>
        <div className="main--flex">
          <div>
            <label for="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={formData.title}
              onChange={(e) => {
                setCourseFormData({ title: e.target.value });
              }}
            ></input>

            <p>
              By{" "}
              {`${context.authenticatedUser.firstName} ${context.authenticatedUser.lastName}`}
            </p>

            <label for="courseDescription">Course Description</label>
            <textarea
              id="courseDescription"
              name="courseDescription"
              value={formData.description}
              onChange={(e) => {
                setCourseFormData({ description: e.target.value });
              }}
            ></textarea>
          </div>
          <div>
            <label for="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => {
                setCourseFormData({ estimatedTime: e.target.value });
              }}
            ></input>

            <label for="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={formData.materialsNeeded}
              onChange={(e) => {
                setCourseFormData({ materialsNeeded: e.target.value });
              }}
            ></textarea>
          </div>
        </div>
        <button
          className="button"
          type="submit"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Create Course
        </button>
        <a className="button button-secondary" href={`/`}>
          Cancel
        </a>
      </form>
    </div>
  );
};

export default CreateCourse;
