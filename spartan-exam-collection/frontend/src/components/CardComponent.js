import React, { Component } from 'react'
import API from '../lib/interceptor';
let api = new API();
export default class CardComponent extends Component {
    getBookmarkStyle = () => {
        let bookmarkedArray = (this.props.user||{}).bookmarked||[];
        let obj = {};
        obj['marginLeft'] = '10px';
        obj['color'] = bookmarkedArray.indexOf((this.props.cardData||{}).uploadId) >= 0 ? 'red' : 'black';
        return obj
    }
    render() {
        let obj = this.props.cardData || {}
        return (
            <div class="col-sm-6 col-md-4 col-lg-4 mt-4">
                <div class="card card-inverse card-info">
                    <div class="card-header">
                        <a onClick={this.props.bookmarkUpload(obj.uploadId)}><i class="fas fa-bookmark float-right" style={this.getBookmarkStyle()}></i></a>
                        <a href={obj.imageSource} target="_blank"><i class="fas fa-eye float-right" style={{ marginLeft: '10px' }}></i></a>
                    </div>
                    <img class="card-img-top" src={obj.imageUrl} />
                    <div class="card-body">
                        <h5 className="card-title">{obj.title}</h5>
                        <p class="card-text">
                            {obj.description}
                        </p>
                    </div>

                </div>
            </div>
        )
    }
}
