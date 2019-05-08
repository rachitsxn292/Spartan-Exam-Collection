var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var multer = require('multer');
var mongoose = require('mongoose');
var uploadExam = require('./models/uploadExam');
var Profile = require('./models/profile');
var jwt = require('./jwt')
let processImage = require('./pythonConnect');
let fs = require('fs')
let path = require('path')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
var myBookmarks = ["1", "2", "4"];

mongoose.connect('mongodb://spartan:spartan@cluster0-shard-00-00-bduua.mongodb.net:27017,cluster0-shard-00-01-bduua.mongodb.net:27017,cluster0-shard-00-02-bduua.mongodb.net:27017/spartancollection?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true').then(d => console.log("Connected Successfully")).catch(e => console.error(e));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
var multer = require('multer')
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            let dir = process.cwd() + "/../uploads";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            callback(null, dir);
        },
        filename: function (req, file, callback) {
            let filename = "File_" + uuid.v1() + "_" + (file.originalname.split(" ").join("").trim()).toLowerCase();
            callback(null, filename);
        },
        onError: function (err, callback) {
            let error = {
                "message": "Error in file upload",
                "code": "MULTERERROR"
            }
            callback([error]);
        }
    }),
})
app.post('/upload',jwt.verifyRequest, upload.array('fileUpload', 10), (req, res, next) => {
    body = req.body || {};
    body.uploadId = body.uploadId || uuid.v1();
    body.title = body.title || "Custom Title";
    body.fileLocation = ((req.files[0] || {}).path || "").split("/uploads/")[1];
    body.processImage = (body.processImage === "true" || body.processImage === true) ? true : false;
    body.imageProcessed = false;
    body.tags = "";
    body.uploadId = uuid.v1();
    if (body.processImage) {
        console.log("SENDING", req.files[0].path, body.uploadId)
        processImage(req.files[0].path, body.uploadId);
    }
    uploadExam.create(body).then((data) => {
        res.json({
            result: 'success',
            message: 'Upload Successful'
        })
    }).catch((err) => {
        console.error(err);
        res.json({
            result: 'failure',
            message: 'Upload Failed'
        })
    })
});
app.post('/user/:userId/bookmark/:uploadId', (req, res, next) => {
    let uploadId = req.params.uploadId;
    let _index = myBookmarks.indexOf(uploadId);
    if (_index >= 0) {
        myBookmarks.splice(_index, 1);
    } else {
        myBookmarks.push(uploadId);
    }
    res.json({
        result: "success",
        response: [{
            code: "CARDS",
            message: "Data Fetched Successfully"
        }]
    });
})
app.get('/user/:userId/bookmarked', (req, res, next) => {
    res.json({
        result: "success",
        response: [{
            code: "CARDS",
            message: "Data Fetched Successfully"
        }],
        cards: [{
            userId: "123",
            uploadId: "1",
            title: "First Image",
            description: "Lorem Ipsum About the image",
            tags: ["rakesh", "ranjan", "cmpe", "272", "project"],
            imageUrl: "https://www.jagranjosh.com/imported/images/E/Articles/2017-Solved-CBSE-Sample-Paper-Class%2010-Maths-SA-2.jpg",
            imageSource: "http://www.africau.edu/images/default/sample.pdf"
        }, {
            userId: "123",
            uploadId: "2",
            title: "First Image",
            description: "Lorem Ipsum About the image",
            tags: ["rakesh", "ranjan", "cmpe", "272", "project"],
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQakR3znFWxs9eKLqYWrOTTE8R9l6m3PZg9rPxCA2kOMqQXC88M2A",
            imageSource: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQakR3znFWxs9eKLqYWrOTTE8R9l6m3PZg9rPxCA2kOMqQXC88M2A"
        }, {
            userId: "123",
            uploadId: "4",
            title: "First Image",
            description: "Lorem Ipsum About the image",
            tags: ["rakesh", "ranjan", "cmpe", "272", "project"],
            imageUrl: "https://www.jagranjosh.com/imported/images/E/Articles/2017-Solved-CBSE-Sample-Paper-Class%2010-Maths-SA-2.jpg",
            imageSource: "https://www.jagranjosh.com/imported/images/E/Articles/2017-Solved-CBSE-Sample-Paper-Class%2010-Maths-SA-2.jpg"
        }]
    })
})
app.get('/user/:userId', (req, res, next) => {
    res.json({
        result: "success",
        response: [{
            code: "CARDS",
            message: "Data Fetched Successfully"
        }],
        user: {
            userId: "123",
            firstName: "Vinit",
            lastName: "Dholakia",
            email: "vinit.dholakia@sjsu.edu",
            bookmarked: myBookmarks,
        }
    })
})
app.get('/image/:filepath', (req, res, next) => {
    let filename = req.params.filepath || null;
    res.sendFile(path.resolve("../uploads/" + filename));
})
app.get('/search',jwt.verifyRequest, (req, res, next) => {
    if (!req.query.q) {
        res.json({
            result: "success",
            message: "Data Fetched Successfully",
            cards: []
        });
    } else {
        uploadExam.find({
            $text: {
                $search: req.query.q
            }
        }).select({
            tags: 0
        }).then(d => {
            console.log(d);
            res.json({
                result: "success",
                message: "Data Fetched Successfully",
                cards: d
            });
        }).catch(e => {
            console.log(e);
        })
    }
})


app.post('/signin', (req, res, next) => {
    Profile.findOne({
            email: req.body.email
        }).exec()
        .then(docs => {
            if (!docs) {
                let userId = uuid.v1();
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    userId: userId,
                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    image: req.body.image,
                });
                profile
                    .save()
                    .then(result => {
                        res.status(200).json({
                            result: 'success',
                            message: 'Signin Successful',
                            data: {
                                userId: userId,
                                email: req.body.email,
                                fname: req.body.fname,
                                lname: req.body.lname,
                                image: req.body.image,
                            },
                            token: jwt.generate({
                                userId :userId
                            })
                        });
                    })

                    .catch(err => {
                        console.log(err);
                        res.status(200).json({
                            result: 'failure',
                            message: err
                        })
                    })
            } else {

                res.status(200).json({
                    result: 'success',
                    message: 'signin successful',
                    data: docs,
                    token: jwt.generate({
                        userId :docs.userId
                    })
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                result: 'failure',
                message: err
            })
        })


});


app.listen(3001);
console.log("server running 3001");