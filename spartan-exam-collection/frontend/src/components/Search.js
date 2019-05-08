import React, { Component } from 'react'
import CardComponent from './CardComponent';
import API from '../lib/interceptor';
let api = new API();
export default class Search extends Component {
    state = {
        cards: [],
        error: "",
        user: {},
        search : ""
    }
    searchNow = (e) => {
        if (!!e) {
            e.preventDefault();
        }

        let value = ((e || {}).target || {}).value || "";
        console.log(value)
        if (!value) {
            this.setState({
                cards: [],
                error: "",
                search : value
            });
        } else {
            let user = this.getUser();
            api.call({
                url: '/user/' + (user || {}).userId,
                method: "GET",
            }).then((dbObj) => {
                let userObj = dbObj.user || {};
                api.call({
                    url: '/search',
                    method: "GET",
                    query: {
                        q: value || ""
                    }
                }).then((data) => {
                    this.setState({
                        cards: !!this.userExists() ? data.cards : [],
                        user: !!this.userExists() ? userObj : {},
                        error: !this.userExists() ? "Login First" : "",
                        search : value
                    });
                }).catch((err) => {
                    this.setState({
                        cards: [],
                        search : value,
                        error: !this.userExists() ? "Login First" : (err.message || "Error Fetching Data")
                    });
                });
            }).catch(err => {
                this.setState({
                    cards: [],
                    search : value,
                    error: !this.userExists() ? "Login First" : (err.message || "Error Fetching Data")
                });
            })
        }
    };
    bookmarkUpload = (uploadId) => {
        let user = this.getUser();
        return (e) => {
            e.preventDefault();
            console.log("BOOKMARKING " + uploadId)
            api.call({
                method: "POST",
                url: "/user/" + user.userId + "/bookmark/" + uploadId
            }).then((data) => {
               
            }).catch((err) => {

            })
        }
    }
    componentDidMount = () => {
        this.props.changeActiveTab("Search");

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
            <div>
                {!!this.state.error && <div class="alert alert-warning" role="alert">
                    Sorry! {this.state.error}
                </div>}

                <div className="input-group">
                    <input type="text" className="form-control" aria-label="Text input with segmented dropdown button" onChange={this.searchNow} />
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-secondary"><i className="fas fa-search"></i>&nbsp;Search</button>
                    </div>
                </div>
                <br />
                <div><h5>Search Results</h5></div>
                <br />
                <div class="card-deck">
                    {!!this.state.cards && !!this.state.cards.length && this.state.cards.map((x, i) => {
                        return <CardComponent cardData={x} user={this.state.user} bookmarkUpload={this.bookmarkUpload} />
                    })
                    }
                </div>
                {!!this.state.cards && !this.state.cards.length && <h6><i>Empty Search Result</i></h6>}


            </div>
        )
    }
}
