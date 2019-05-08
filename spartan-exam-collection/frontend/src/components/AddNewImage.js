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
        title: "",
        description: "",
        error: "",
        success : "",
    }
    _handleImageChange = (e) => {
        e.preventDefault();
        if(!this.userExists()){
            this.setState({
                error : "Login First",
                success : "",
            });
            return
        }
        
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                _url: reader.result,
                success : "",
                error : ""
            });
        }
        reader.readAsDataURL(file)
    }
    handleTextChange = (e) => {
        if(!this.userExists()){
            this.setState({
                error : "Login First",
                success : "",
            });
            return
        }
        this.setState({
            [e.target.name]: e.target.value,
            success : "",
            error : ""
        });
    }
    handleCheckBox = (e) => {
        if(!this.userExists()){
            this.setState({
                error : "Login First",
                success : "",
            });
            return
        }
        console.log("VLAUE  ", e.target.name, e.target.value)
        this.setState({
            processImage: !this.state.processImage,
            success : "",
            error : ""
        });
    }
    uploadImage = (e) => {
        if(!this.userExists()){
            this.setState({
                error : "Login First",
                success : "",
            });
            return
        }
        e.preventDefault();
        let auth = this.props.auth;
        let fD = new FormData();
        console.log(this.state)
        fD.append('fileUpload', this.state.file);
        fD.append('title', this.state.title);
        fD.append('processImage', this.state.processImage);
        fD.append('description', this.state.description);
        if (!this.state.title || !this.state.file) {
            this.setState({
                error: "Some fields are Missing !"
            })
        } else {
            let str = this.state.processImage ? "Your Image will be processed shortly." : ''
            api.call({
                data: fD,
                url: '/upload',
                method: 'POST'
            }).then((data) => {
                this.setState({
                    file: null,
                    _url: null,
                    processImage: true,
                    title: "",
                    description: "",
                    error: "",
                    success : `Your image has been successfully uploaded. ${str}`
                })
            }).catch((err) => {
                console.log(err);
            })
        }
        //do some Call
    }
    componentDidMount = () => {
        this.props.changeActiveTab("New");
        if(!this.userExists()){
            this.setState({
                error : "Login First",
                success : "",
            });
            return
        }
    }
    userExists = ()=>
    {
        return !!localStorage.getItem("token") ? true : false;
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
                {!!this.state.error && <div class="alert alert-warning" role="alert">
                    Sorry! {this.state.error}
                </div>}
                {!!this.state.success && <div class="alert alert-success" role="alert">
                    Voila! {this.state.success}
                </div>}
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
                                <input type="title" name="title" class="form-control" id="exampleInputtitle1" aria-describedby="titleHelp" placeholder="Enter Title" onChange={this.handleTextChange} value={this.state.title} required />
                                <small id="titleHelp" class="form-text text-muted">Title of the Image</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputDescription1">Description</label>
                                <input type="Description" name="description" class="form-control" id="exampleInputDescription1" placeholder="Brief Description" value={this.state.description} onChange={this.handleTextChange} />
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
