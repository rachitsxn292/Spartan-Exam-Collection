import React, { Component } from 'react'
import GoogleLogin from 'react-google-login';
import API from './../lib/interceptor';
const api = new API();
export default class Header extends Component {
    state = {
        error: "",
        success: ""
    }
    onError = (error) => {
        console.log(error)
    }
    signInNow = (googleUser) => {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        api.call({
            url: '/signin',
            method: 'POST',
            data: {
                fname: profile.getName().split(" ")[0],
                lname: profile.getName().split(" ")[1] || "",
                image: profile.getImageUrl(),
                email: profile.getEmail(),
            }
        }).then((data) => {
            console.log("SiGNIN ", data.data.userId, data.token);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.data));
            this.setState({
                error: "",
                success: "Login Successful"
            });
        }).catch((err) => {
            console.log(err)
            localStorage.clear();
            this.setState({
                error: "Login Failed",
                success: ""
            });
        })
    }
    userExists = () => {
        return !!localStorage.getItem("token") ? true : false;
    }
    getUser = () => {
        let user = localStorage.getItem("user")
        if (!!user) {
            user = JSON.parse(user);
        }
        return user || {};
    }
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                    <button type="button" onClick={this.props.sidebarCollapse} className="btn btn-info">
                        <i className="fas fa-align-left"></i>

                    </button>
                    <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fas fa-align-justify"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item">

                                {!!this.userExists() ? `Welcome ${this.getUser().fname}` : <GoogleLogin
                                    clientId="624602059574-qsv45kcgn89v376114ql2ps2t5rljfd7.apps.googleusercontent.com"
                                    buttonText="Sign in with Google"
                                    onSuccess={this.signInNow}
                                    onFailure={this.onError}
                                    cookiePolicy={'single_host_origin'}
                                />}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
