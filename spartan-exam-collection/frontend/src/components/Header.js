import React, { Component } from 'react'
import API from './../lib/interceptor';
const api = new API();
export default class Header extends Component {
    state = {
        error : "",
        success : ""
    }
    onSignIn = (googleUser) => {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
    signInNow = (e) => {
        e.preventDefault();
        api.call({
            url : '/signin',
            method : 'POST',
            data : {
                fname : 'vinit',
                lname : 'dholakia',
                image : 'efg',
                email : 'vinit.dholakia@gmail.com',
            }
        }).then((data)=>{
            console.log("SiGNIN ",data.data.userId,data.token);
            localStorage.setItem("token",data.token);
            localStorage.setItem("user",JSON.stringify(data.data));
            this.setState({
                error : "",
                success : "Login Successful"
            });
        }).catch((err)=>{
            console.log(err)
            localStorage.clear();
            this.setState({
                error : "Login Failed",
                success : ""
            });
        })
    }
    userExists = ()=>
    {
        return !!localStorage.getItem("token") ? true : false;
    }
    getUser = ()=>{
        let user = localStorage.getItem("user")
        if(!!user){
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
                                <div class="g-signin2" data-onsuccess={this.onSignIn}></div>
                                {/* {!!this.userExists() ? `Welcome ${this.getUser().fname}` :<button className="btn btn-sm btn-secondary" onClick={this.signInNow}>SignIn</button>} */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
