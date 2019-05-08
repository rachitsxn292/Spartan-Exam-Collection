import React, { Component } from 'react'
import CardComponent from './CardComponent';
import API from '../lib/interceptor';
let api = new API();
export default class Bookmarked extends Component {
    state = {
        cards: [],
        error: "",
        user: {}
    }
    getBookmarks = (e) => {
        if (!!e) {
            e.preventDefault();
        }
        if(!this.userExists()){
            this.setState({
                cards: [],
                error: "Login First"
            });
            return;
        }
        let user = this.getUser();
        let value = ((e || {}).target || {}).value || "";
        api.call({
            url: '/user/'+user.userId,
            method: "GET",
        }).then((dbObj) => {
            let userObj = dbObj.user || {};
            console.log(userObj)
            api.call({
                url: '/user/'+user.userId+'/bookmarked',
                method: "GET",
            }).then((data) => {
                this.setState({
                    cards: data.cards || [],
                    user: userObj,
                    error: ""
                });
            }).catch((err) => {
                this.setState({
                    cards: [],
                    error: err.message || "Error Fetching Data"
                });
            });
        }).catch(err => {
            this.setState({
                cards: [],
                error: err.message || "Error Fetching Data"
            });
        })

    };

    componentDidMount = () => {
        this.props.changeActiveTab("Bookmark");
        this.getBookmarks();
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
    bookmarkUpload = (uploadId) => {
        let user = this.getUser();
        return (e) => {
            e.preventDefault();
            console.log("BOOKMARKING " + uploadId)
            api.call({
                method: "POST",
                url: "/user/" + user.userId + "/bookmark/" + uploadId
            }).then((data) => {
                this.getBookmarks()
            }).catch((err) => {
                
            })
        }
    }
    render() {
        
        return (
            
            <div>
                {!!this.state.error && <div class="alert alert-warning" role="alert">
                    Sorry ! {this.state.error}
                </div>}
                <div><h5>My Bookmarks</h5></div>
                <br />
                <div class="card-deck">
                    {!!this.state.cards && !!this.state.cards.length && this.state.cards.map((x, i) => {
                        return <CardComponent cardData={x} user={this.state.user} bookmarkUpload={this.bookmarkUpload} />
                    })
                    }
                </div>
                {!!this.state.cards && !this.state.cards.length && <h6><i>No Bookmarks yet</i></h6>}


            </div>
        )
    }
}
