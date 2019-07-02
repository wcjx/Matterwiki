import React from "react";
import { hashHistory } from "react-router";
import Alert from "react-s-alert";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.user = { name: "", about: "", email: "" };
  }

  componentDidMount() {
    var myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      "x-access-token": window.localStorage.getItem("userToken")
    });
    var myInit = { method: "GET", headers: myHeaders };
    var that = this;
    fetch("/api/users/" + window.localStorage.getItem("userId"), myInit)
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        if (response.error.error) Alert.error(response.error.message);
        else {
          that.user.name=response.data.name;
          that.user.about=response.data.about;
          that.user.email=response.data.email;
        }
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    var email = this.user.email;
    var name = this.user.name;
    var about = this.user.about;
    var currentPassword = document.getElementById("currentPassword").value;
    var password = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if(password!==confirmPassword){
      Alert.warning('New password mismatch.')
      return
    }
    var myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    var myInit = {
      method: "POST",
      headers: myHeaders,
      body:
        "email=" +
        encodeURIComponent(email) +
        "&password=" +
        encodeURIComponent(currentPassword)
    };
    var that = this;
    fetch("/api/authenticate", myInit)
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        if (response.error.error) Alert.error(response.error.message);
        else {
          var user = {
            name: encodeURIComponent(name),
            about: encodeURIComponent(about),
            email: encodeURIComponent(email),
            password: encodeURIComponent(password),
            id: encodeURIComponent(response.data.user.id)
          };
          var myHeaders = new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": window.localStorage.getItem("userToken")
          });
          var myInit = {
            method: "PUT",
            headers: myHeaders,
            body:
              "name=" +
              user.name +
              "&about=" +
              user.about +
              "&email=" +
              user.email +
              "&password=" +
              user.password +
              "&id=" +
              user.id
          };
          var that = this;
          fetch("/api/users/", myInit)
            .then(function(response) {
              return response.json();
            })
            .then(function(response) {
              if (response.error.error) Alert.error(response.error.message);
              else {
                Alert.success("Your password has been changed");
                hashHistory.push("home");
              }
            });
        }
      });
  }

  render() {
    return (
      <div className="container login-box row">
        <div className="col-md-12 col-sm-12">
          <h3>Change your password</h3>
          <form>
            <div className="col-sm-12 form-group">
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                placeholder="Current password"
              />
            </div>
            <div className="col-sm-12 form-group">
              <input
                type="password"
                className="form-control"
                id="newPassword"
                placeholder="New password"
              />
            </div>
            <div className="col-sm-12 form-group">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
              />
            </div>
            <div className="col-sm-12 form-group">
              <button
                onClick={this.handleSubmit}
                className="btn btn-default btn-block btn-lg"
              >
                Change password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ChangePassword;
