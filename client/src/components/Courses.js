import React, { useState, useEffect, useContext } from "react";
import { CoursesContext } from "../Context";
import { useHistory } from "react-router";

// Component imports
import Course from "./Course";
import AddNew from "./AddNew";

// Courses uses the getAllCourses method from context to retrieve all courses and render them to the page

const Courses = ({ context }) => {
  // imports the history object
  const history = useHistory();
  // Used to force the component to finish loading before returning the courses
  const [isLoading, setLoading] = useState(true);

  // adds the course list to state, and provides the method to update it
  const [courseList, setCourseList] = useState();

  // will call the api when the component is first loaded
  useEffect(async () => {
    try {
      let response = await context.data.getAllCourses();
      // If the API encountered a problem, a 500 error is returned
      if (response === 500) {
        throw new Error();
      } else {
        // passes each course from the response object to Course, where it is returned as a finished link
        response = await response.map((course) => {
          return <Course course={course} />;
        });
        // adds the course list to state
        setCourseList(response);
        // sets loading to false so that the list is rendered to the ui
        setLoading(false);
      }
    } catch (error) {
      history.push("/error");
    }
  }, []);

  // component will show a loading div until courses are retrieved from the API and added to state
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className={"wrap main--grid"}>
      {courseList}
      <AddNew />
    </div>
  );
};

export default Courses;
