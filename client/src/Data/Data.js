import config from "./config";

export default class Data {
  // Handles GET and POST requests to the REST API. Accepts the endpoint, http method, and body
  // requiresAuth and credentials are given default values to avoid undefined errors

  api(
    path,
    method = "GET",
    body = null,
    requiresAuth = false,
    credentials = null
  ) {
    //configures the request path by combining the base URL + the path passed in
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    // Stringifies the body if it is not null
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      // creates a base-64 encoded ASCII string from a "string" of data to encode username and password
      const encodedCredentials = btoa(
        `${credentials.username}:${credentials.password}`
      );

      //Creates the basic authorization headers with the encoded credentials string
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // function to create new courses
  async createCourse(body, username, password) {
    const response = await this.api(`/courses`, "POST", body, true, {
      username,
      password,
    });
    if (response.status === 201) {
      return null;
    } else if (response.status === 400) {
      return response.json((res) => res);
    }
  }

  // function to delete courses
  async deleteCourse(id, username, password) {
    const response = await this.api(`/courses/${id}`, "DELETE", null, true, {
      username,
      password,
    });
    if (response.status === 204) {
      return null;
    } else {
      return 500;
    }
  }

  // login function
  async getUser(username, password) {
    const response = await this.api(`/users`, "GET", null, true, {
      username,
      password,
    });
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else if (response.status === 401) {
      return null;
    }
  }

  // function to create a user
  async createUser() {
    const response = await this.api(`/users`, "GET", null, false);
    if (response.status === 201) {
      return null;
    } else {
      return response.json().then((res) => res);
    }
  }

  // function to get all courses
  async getAllCourses() {
    const response = await this.api(`/courses`, "GET", null, false);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      return 500;
    }
  }

  // Function to get a specific course by id
  async courseDetail(id) {
    const response = await this.api(`/courses/${id}`, "GET", null, false);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else if (response.status === 404) {
      return 404;
    } else {
      return 500;
    }
  }

  // Function to update course details
  async updateCourse(id, data, username, password) {
    const response = await this.api(`/courses/${id}`, `PUT`, data, true, {
      username,
      password,
    });
    if (response.status !== 204) {
      return response.status;
    } else {
      return null;
    }
  }

  // Function to create a new user
  async createUser(user) {
    const response = await this.api("/users", "POST", user);
    try {
      if (response.status === 201) {
        return null;
      } else if (response.status === 400) {
        return response.json().then((res) => res);
      }
    } catch (error) {
      return error.message;
    }
  }
}
