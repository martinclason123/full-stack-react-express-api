import React from "react";
import { Link } from "react-router-dom";

// Header for application. Shows the users first and last name if logged in
const Header = (props) => {
  const { context } = props;
  const authUser = context.authenticatedUser;
  return (
    <header>
      <div className="wrap header--flex">
        <h1 className="header--logo">
          <a href="/">Courses</a>
        </h1>
        <nav>
          {authUser ? (
            <React.Fragment>
              <ul className="header--signedin">
                <li>Welcome, {`${authUser.firstName} ${authUser.lastName}`}</li>
                <li>
                  <Link to="/signout">Sign Out</Link>
                </li>
              </ul>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ul className="header--signedout">
                <li>
                  <Link to="/signup">Sign Up </Link>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
              </ul>
            </React.Fragment>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
