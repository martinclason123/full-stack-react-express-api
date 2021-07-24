import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

// This component will load a course by id, collect the user's changes, and send those changes to the API
const UpdateCourse = ({ context }) => {
  // allows a redirect to the home page after a new course is created
  const history = useHistory();

  // array to hold validation errors on submit
  let errorsArray = [];

  // variable to hold validation errors. Is set by the handleSubmit function
  let errorsJSX;

  // imports the api methods into the component
  //const { actions } = useContext(CoursesContext);

  // gets the id from the url
  const { id } = useParams();

  // used to show a loading message while waiting for the course details to populate
  const [isLoading, setLoading] = useState(true);

  // The specific course, and its materials needed are put in state in this component
  const [courseDetails, setCourseDetails] = useState();

  // holds the chagning input data throughout the form
  const [courseFormData, setCourseFormData] = useState();

  // holds any errors JSX collected by the validation in the handleSubmit function
  const [formErrors, setFormErrors] = useState();

  // function that puts the input field data into state as the end user types
  const setFormData = (properties) => {
    setCourseFormData({
      ...courseFormData,
      ...properties,
    });
  };

  useEffect(async () => {
    // retrieves the specific course from the db
    try {
      let data = await context.data.courseDetail(id);
      if (data === 404) {
        history.push("/notfound");
      } else if (data.userId !== context.authenticatedUser.id) {
        history.push("/forbidden");
      } else if (data === 500) {
        throw new Error();
      } else {
        // puts the course into state
        await setCourseDetails(data);
        // initializes the form data stateful object
        setCourseFormData(data);
        // sets loading to false so that the data will be displayed
        setLoading(false);
      }
    } catch (error) {
      history.push("/error");
    }
  }, []);

  // Handles the form submit, prevents the default, and sends the collected form data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courseFormData.description || courseFormData.description === "") {
      errorsArray.push("Please provide a description");
    }
    if (!courseFormData.title || courseFormData.title === "") {
      errorsArray.push("Please provide a title");
    }
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
    } else {
      await context.data.updateCourse(
        id,
        courseFormData,
        context.authenticatedUser.emailAddress,
        context.userPassword
      );
      history.push(`/courses/${id}`);
    }
  };

  // component will show a loading div until courses are retrieved from the API and added to state
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  // This form will collect the data, put it in the the courseFormData object, whoch will then be provided to Context's updateCourse function
  return (
    <div className="wrap">
      <form>
        <div className="main--flex">
          <div>
            {formErrors}
            <label for="courseTitle">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={courseFormData.title}
              onChange={(e) => {
                setFormData({ title: e.target.value });
              }}
            ></input>

            <p>{`By ${courseDetails.user.firstName} ${courseDetails.user.lastName}`}</p>

            <label for="courseDescription">Course Description</label>

            <textarea
              id="courseDescription"
              name="courseDescription"
              onChange={(e) => {
                setFormData({ description: e.target.value });
              }}
            >
              {courseDetails.description}
            </textarea>
          </div>
          <div>
            <label for="estimatedTime">Estimated Time</label>
            <input
              id="estimatedTime"
              name="estimatedTime"
              type="text"
              value={courseFormData.estimatedTime}
              onChange={(e) => {
                setFormData({ estimatedTime: e.target.value });
              }}
            ></input>

            <label for="materialsNeeded">Materials Needed</label>
            <textarea
              id="materialsNeeded"
              name="materialsNeeded"
              value={courseFormData.materialsNeeded}
              onChange={(e) => {
                setFormData({ materialsNeeded: e.target.value });
              }}
            ></textarea>
          </div>
        </div>
        <button
          class="button"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Update Course
        </button>
        <a className="button button-secondary" href={`/`}>
          Cancel
        </a>
      </form>
    </div>
  );
};

export default UpdateCourse;
