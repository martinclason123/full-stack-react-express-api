import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useHistory } from "react-router-dom";

const CourseDetail = ({ context }) => {
  // allows a redirect to the home page after a course is deleted
  const history = useHistory();

  // gets the user from context
  const user = context.authenticatedUser;

  // gets the id from the url
  const { id } = useParams();
  // used to show a loading message while waiting for the course details to populate
  const [isLoading, setLoading] = useState(true);

  // The specific course, and its materials needed are put in state in this component
  const [courseDetails, setCourseDetails] = useState();

  useEffect(() => {
    async function fetchData() {
      // retrieves the specific course from the db
      try {
        let response = await context.data.courseDetail(id);
        // if the response data is 404, redirect to 404 page
        if (response === 404) {
          history.push("/notfound");
        } else if (response === 500) {
          // handles server errors
          throw new Error();
        } else {
          // puts the course into state
          await setCourseDetails(response);
        }
      } catch (error) {
        history.push("/error");
      }

      setLoading(false);
    }
    fetchData();
  }, [id, history, context]);

  // component will show a loading div until courses are retrieved from the API and added to state
  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  // function that uses the deleteCourse function in data/data.js
  const clickDelete = async (e) => {
    e.preventDefault();
    try {
      let response = await context.data.deleteCourse(
        id,
        context.authenticatedUser.emailAddress,
        context.userPassword
      );
      if (response === null) {
        history.push("/");
      } else {
        throw new Error(response);
      }
    } catch (error) {
      history.push("/error");
    }
  };
  return (
    <main>
      {/* Will only show the delete course and update course buttons if the user is logged in, and the user owns the course */}
      {user && user.id === courseDetails.user.id ? (
        <div className="actions--bar">
          <div className="wrap">
            <a className="button" href={`/courses/${id}/update`}>
              Update Course
            </a>
            <button
              className="button"
              onClick={(e) => {
                clickDelete(e);
              }}
            >
              Delete Course
            </button>

            <a className="button button-secondary" href="/">
              Return to List
            </a>
          </div>
        </div>
      ) : (
        <div className="actions--bar">
          <a className="button button-secondary" href="/">
            Return to List
          </a>
          <div className="wrap"></div>
        </div>
      )}

      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{courseDetails.title}</h4>
              <p>
                By{" "}
                {`${courseDetails.user.firstName} ${courseDetails.user.lastName}`}
              </p>

              <p>
                <ReactMarkdown>{courseDetails.description}</ReactMarkdown>
              </p>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              <p>{courseDetails.estimatedTime}</p>

              <h3 className="course--detail--title">Materials Needed</h3>
              <ReactMarkdown className="course--detail--list">
                {courseDetails.materialsNeeded}
              </ReactMarkdown>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CourseDetail;
