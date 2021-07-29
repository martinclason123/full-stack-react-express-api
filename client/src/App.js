import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Courses from "./components/Courses";
import CourseDetail from "./components/CourseDetail";
import Header from "./components/Header";
import UpdateCourse from "./components/UpdateCourse";
import CreateCourse from "./components/CreateCourse";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";

import PrivateRoute from "./components/PrivateRoute";
import UnhandledError from "./components/UnhandledError";
import Forbidden from "./components/Forbidden";
import NotFound from "./components/NotFound";

// importing context to components from compnents/index.js
import withContext from "./Context";

// This connects the UserSignUp component to context. UserSignUp is now a consuming component that's subscribed to all context changes.
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const HeaderWithContext = withContext(Header);

const CreateCoursewithContext = withContext(CreateCourse);
const CourseDetailWithContext = withContext(CourseDetail);
const UpdateCourseWithContext = withContext(UpdateCourse);
const CoursesWithContext = withContext(Courses);

const App = () => (
  <Router>
    <div className="App">
      <HeaderWithContext />
      <Switch>
        <Route exact path="/forbidden" component={Forbidden} />
        <Route exact path="/error" component={UnhandledError} />
        <Route exact path="/signout" component={UserSignOutWithContext} />
        <Route exact path="/signUp" component={UserSignUpWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <PrivateRoute
          exact
          path="/courses/create"
          component={CreateCoursewithContext}
        />
        <PrivateRoute
          exact
          path="/courses/:id/update"
          component={UpdateCourseWithContext}
        />
        <Route exact path="/" component={CoursesWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <Route exact path="/notfound" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

export default App;
