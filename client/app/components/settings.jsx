import React from "react";
import { hashHistory } from "react-router";
import Alert from "react-s-alert";
import Loader from './loader.jsx';
import handleError from '../handle_error';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editUser = this.editUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {loading: true, name: "", about: "", email: "", password: ""}
    this.user ={name:'',about:'',email:''}
  }

  handleChange() {
    this.setState({name: this.refs.user_name.value, about: this.refs.user_about.value,  password: this.refs.user_password.value});
  }

  componentDidMount() {
    var myHeaders = new Headers({
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": window.localStorage.getItem('userToken')
    });
    var myInit = { method: 'GET',
               headers: myHeaders,
               };
    var that = this;
    fetch('/api/users/'+window.localStorage.getItem('userId'),myInit)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if(response.error.error)
        handleError(response.error.message,response.code);
      else {
        that.user.name=response.data.name;
        that.user.about=response.data.about;
        that.user.email=response.data.email;
        that.setState({name: response.data.name, about: response.data.about, email: response.data.email, loading: false})
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var name = this.user.name;
    var about = this.user.about;
    var email=this.user.email;
    var currentPassword = document.getElementById("currentPassword").value;
    var password = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if(password!==confirmPassword){
      Alert.error('New password mismatch.')
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
                hashHistory.push('home');          
              }
            });
        }
      });
  }

  editUser(e) {
    e.preventDefault();
    var email = this.state.email;
    var name =this.state.name;
    var about =this.state.about;
    var password = document.getElementById("inputPassword").value;
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
        encodeURIComponent(password)
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
                Alert.success("User has been updated");
                hashHistory.push('home'); 
              }
            });
        }
      });
  }

  render() {
    if(this.state.loading)
      return <Loader />
    else
    return (
      <div className="row">
      <div className="col-md-12 col-sd-12">
        <h1><b>Update User</b></h1>
        <br/>
          <form>
            <div className="col-sm-12 form-group">
              <input type="text" className="form-control" ref="user_name" id="inputUserName" placeholder="Name" value={this.state.name} onChange={this.handleChange} />
            </div>
            <div className="col-sm-12 form-group">
              <input type="text" className="form-control" ref="user_about" id="inputUserAbout" placeholder="About" value={this.state.about} onChange={this.handleChange}/>
            </div>
            <div className="col-sm-12 form-group">
              <input type="password" className="form-control" ref="user_password" id="inputPassword" placeholder="Input password to confirm" />
            </div>
        <div className="col-sm-12 form-group">
          <button onClick={this.editUser} className="btn btn-default btn-block btn-lg">Update User</button>
        </div>
      </form>
      </div>
      <div className="col-md-12 col-sd-12">
        <h1><b>Change your password</b></h1>
        <br/>
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

export default Settings;
