import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      message: "",
      loading: false,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;

    if (username === "" || password === "") {
      this.setState({ message: "Username and password are required." });
      return;
    }

    this.setState({ loading: true });

    axios
      .post("http://localhost:8000/login/", { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            message: response.data.success,
            username: "",
            password: "",
            loading: false,
          });
          if (this.props.onLogin) {
            this.props.onLogin(response.data.token);  // Pass token to parent component
          }
          setTimeout(() => this.setState({ message: "" }), 3000);
        } else {
          this.setState({
            message: response.data.error || "An unexpected error occurred.",
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        if (error.response && error.response.data.error) {
          this.setState({ message: error.response.data.error, loading: false });
        } else {
          this.setState({
            message: "An error occurred during login.",
            loading: false,
          });
        }
      });
  };

  render() {
    return (
      <div className="centered-form">
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-custom" disabled={this.state.loading}>
            {this.state.loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Login;
