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
        let value = ((e || {}).target || {}).value || "";
        api.call({
            url: '/user/123',
            method: "GET",
        }).then((dbObj) => {
            let userObj = dbObj.user || {};
            console.log(userObj)
            api.call({
                url: '/user/123/bookmarked',
                method: "GET",
            }).then((data) => {
                this.setState({
                    cards: data.cards || [],
                    user: userObj
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

    bookmarkUpload = (uploadId) => {
        console.log("UPLAOD ID ",uploadId)
        return (e) => {
            e.preventDefault();
            console.log("BOOKMARKING "+uploadId)
            api.call({
                method: "POST",
                url: "/user/123/bookmark/" + uploadId
            }).then(() => {
                this.getBookmarks();
            }).catch((err) => {
                this.setState({
                    cards: [],
                    error: err.message || "Error Fetching Data"
                });
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
                {!!this.state.cards && !this.state.cards.length && <h5><i>No Data Available</i></h5>}


            </div>
        )
    }
}
