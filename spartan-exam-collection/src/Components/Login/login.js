import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import GoogleLogin from 'react-google-login';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';

//you wanna copy this file for componenets
class Login extends Component {
    constructor() {
        super();

        this.state = {
            
            status:"",
            username:"",
            password:""
        }
        this.responseGoogle = this.responseGoogle.bind(this);
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    }

    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value
        })
    }
   
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    responseGoogle = (response) => {
        
        console.log(response);
        if(response.error){
            alert(response.error);
        }
        else{
            const data = {
                email:response.profileObj.email,
                lname: response.profileObj.familyName,
                fname:response.profileObj.givenName,
                image:response.profileObj.imageUrl
            };
            console.log("data",data);
            // axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/google', data)
                .then((response) => {
                    console.log("Status Code : ", response.status);
                    if (response.status === 200) {
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('fname', response.data.fname);
                        localStorage.setItem('lname', response.data.lname);
                        localStorage.setItem('image', response.data.image);
    
                        this.setState({
                           
                            status: response.data.message,
                        })
                    }
                    else {
                       this.setState({
                        
                        status: response.data.message
                    })
                        
                    }
                });
        }
    }




    componentDidMount() {


    }


    render() {
        let redirectVar = null;

        if (cookie.load('cookie')) {
            console.log("cookie is defined");
            redirectVar = <Redirect to="/home" />  

        }
        return (
            <div>
                {redirectVar}
                <div class="body"></div>
                <div class="grad"></div>
                <div class="panel">
                    <div class="google">
                        <GoogleLogin
                            clientId="624602059574-qsv45kcgn89v376114ql2ps2t5rljfd7.apps.googleusercontent.com"
                            buttonText="Sign in with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        <br/><br/>
                        <small><Link to="/signup">Sign Up With Email.</Link> By signing up you indicate that you have read and agree to Quora's Terms of Service and Privacy Policy.</small>
                    </div>

                </div>
            </div>

        )
    }
}


//export this Component
export default Login;
