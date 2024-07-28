import React, { Component } from "react";
import axios from "axios";

class Register extends Component {
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

    if (password.length < 6) {
      this.setState({ message: "Password must be at least 6 characters long." });
      return;
    }

    this.setState({ loading: true });

    axios
      .post("http://localhost:8000/register/", { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.status === 201) {
          this.setState({
            message: response.data.success,
            username: "",
            password: "",
            loading: false,
          });
          if (this.props.onRegister) {
            this.props.onRegister();
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
        console.error("Error during registration:", error);
        if (error.response && error.response.data.error) {
          this.setState({ message: error.response.data.error, loading: false });
        } else {
          this.setState({
            message: "An error occurred during registration.",
            loading: false,
          });
        }
      });
  };

  render() {
    return (
      <div className="centered-form">
        <h2>Register</h2>
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
            {this.state.loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Register;
