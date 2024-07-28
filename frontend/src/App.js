import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from 'axios';
import Register from "./components/Register";
import Login from "./components/Login";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      taskList: [],
      isAuthenticated: false,
      token: "",
      view: "home"  // initial view can be "home", "login", or "register"
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    if (!this.state.isAuthenticated) return;
    axios
      .get("http://localhost:8000/api/tasks/", {
        headers: { Authorization: `Token ${this.state.token}` }
      })
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err));
  };

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  handleRegister = () => {
    this.setState({ view: "register" });
  };

  handleLogin = (token) => {
    this.setState({ isAuthenticated: true, token, view: "tasks" }, this.refreshList);
  };

  handleLogout = () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.state.token}`,
    };

    axios.post("http://localhost:8000/logout/", null, { headers })
      .then(() => {
        this.setState({ isAuthenticated: false, token: "", view: "home" });
      })
      .catch(err => console.log(err));
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-success"
          >
            <img src="/edit.png" alt="" className="image-icon" />
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            <img src="/delete.png" alt="" className="image-icon" />
            Delete
          </button>
        </span>
      </li>
    ));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = item => {
    this.toggle();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.state.token}`,
    };
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item, { headers })
        .then(res => this.refreshList())
        .catch(err => console.log(err));
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/", item, { headers })
      .then(res => this.refreshList())
      .catch(err => console.log(err));
  };

  handleDelete = item => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.state.token}`,
    };
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`, { headers })
      .then(res => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  render() {
    let content;
    switch (this.state.view) {
      case "register":
        content = <Register onRegister={this.handleRegister} />;
        break;
      case "login":
        content = <Login onLogin={this.handleLogin} />;
        break;
      case "tasks":
        content = (
          <div>
            <div className="row">
              <div className="col-md-6 col-sm-10 mx-auto p-0">
                <div className="card p-3">
                  <div className="">
                    <button onClick={this.createItem} className="btn btn-primary"

                    style={
                      {
                        fontWeight:"500"
                      }
                    }
                   
                    >
                      Add task
                    </button>
                    <button onClick={this.handleLogout} className="btn btn-secondary ml-2"
                    style={{
                      fontWeight: "500",
                      marginLeft: "229px",
                    }}
                    >
                      Logout
                    </button>
                  </div>
                  {this.renderTabList()}
                  <ul className="list-group list-group-flush">
                    {this.renderItems()}
                  </ul>
                </div>
              </div>
            </div>
            <footer className="my-3 mb-2 footer">
              Copyright 2024 &copy; All Right Reserved
            </footer>
            {this.state.modal ? (
              <Modal
                activeItem={this.state.activeItem}
                toggle={this.toggle}
                onSave={this.handleSubmit}
              />
            ) : null}
          </div>
        );
        break;
        default:
          content = (
            <div className="text-center">
              <img src="/project-management.png" alt="Task Manager Logo" className="logo" />
              <h1 className="text-black text-uppercase text-center my-4">Task Manager</h1>
              <button onClick={() => this.setState({ view: "login" })} className="btn btn-primary mr-2"
                >
                Login
              </button>
              <button onClick={() => this.setState({ view: "register" })} className="btn btn-secondary">
                Register
              </button>
            </div>
          );
          break;
      }

    return (
      <main className="content main-content">
        {content}
      </main>
    );
  }
}

export default App;
