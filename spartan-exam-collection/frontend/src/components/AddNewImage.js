import React, {
    Component
} from 'react'
import API from './../lib/interceptor';
const api = new API();
class AddNewImage extends Component {

    state = {
        file: null,
        _url: null,
        processImage: true,
        title: null,
        description: null,
        error: ""
    }
    _handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                _url: reader.result
            });
        }
        reader.readAsDataURL(file)
    }
    handleTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleCheckBox = (e) => {
        console.log("VLAUE  ", e.target.name, e.target.value)
        this.setState({
            processImage: !this.state.processImage,
        });
    }
    uploadImage = (e) => {
        e.preventDefault();
        let auth = this.props.auth;
        let fD = new FormData();
        console.log(this.state)
        fD.append('fileUpload', this.state.file);
        fD.append('title', this.state.title);
        fD.append('processImage', this.state.processImage);
        fD.append('description', this.state.description);
        api.call({
            body: fD,
            url: '/upload',
            method: 'POST'
        }).then((data) => { 
            console.log(data) 
        }).catch((err) => {
            console.log(err);
        })
        //do some Call
    }
    componentDidMount = () => {
        this.props.changeActiveTab("New");
    }
    render() {
        let { _url } = this.state || {};
        let preview = (<p style={{ float: 'right' }}>Please select an Image for Preview</p>);
        let canSubmit = false;
        if (_url) {
            preview = (<div><embed src={_url} style={{ width: '100%', minHeight: '400px' }} ></embed></div>);
            canSubmit = true;
        }
        return (
            <div>
                <h4 className="text-center">Upload New Paper/Book</h4>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupFileAddon01">Upload</span>
                    </div>
                    <div className="custom-file">
                        <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" onChange={(e) => this._handleImageChange(e)} />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                    </div>
                </div>
                <div class="row" style={{ marginTop: '30px' }}>
                    <div class="col-6">
                        {preview}

                    </div>
                    <div class="col-6">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputtitle1">Title</label>
                                <input type="title" name="title" class="form-control" id="exampleInputtitle1" aria-describedby="titleHelp" placeholder="Enter Title" onChange={this.handleTextChange} required />
                                <small id="titleHelp" class="form-text text-muted">Title of the Image</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputDescription1">Description</label>
                                <input type="Description" name="description" class="form-control" id="exampleInputDescription1" placeholder="Brief Description" onChange={this.handleTextChange} />
                            </div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" onChange={this.handleCheckBox} checked={this.state.processImage} />
                                <label class="form-check-label" for="exampleCheck1">Process Image for Tags</label>
                            </div>
                            <br />
                            {canSubmit && <button type="submit" className="btn btn-primary" onClick={this.uploadImage}>Upload Now</button>}
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}
export default AddNewImage;
