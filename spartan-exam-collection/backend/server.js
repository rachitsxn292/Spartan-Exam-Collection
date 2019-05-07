var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var multer = require('multer');
var mongoose = require('mongoose');
var uploadExam = require('./models/uploadExam');
var Profile = require('./models/profile');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
var myBookmarks = ["1", "2", "4"];

//MONGODB CONNECT STRING
//mongoose.connect('mongodb+srv://spartan:spartan@cluster0-bduua.mongodb.net/test?retryWrites=true');
//MONGDB CONNECTION STRING END


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
var multer = require('multer')
var upload = multer({
    dest: process.cwd() + "/../uploads"
})

app.post('/upload', upload.single('fileUpload'), (req, res, next) => {
    console.log(req.file)
    body = req.body || {};
    body.uploadId = body.uploadId || uuid.v1();
    body.title = body.title || "Custom Title";
    body.filepath = (req.file || {}).filepath || "";
    body.processImage = (body.processImage === "true" || body.processImage === true) ? true : false;
    console.log(JSON.stringify(body, null, 2))
    res.json({
        result: "success",
        response: [{
            code: "CARDS",
            message: "Data Fetched Successfully"
        }]
    });
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
app.get('/search', (req, res, next) => {
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
            uploadId: "3",
            title: "First Image",
            description: "Lorem Ipsum About the image",
            tags: ["rakesh", "ranjan", "cmpe", "272", "project"],
            imageUrl: "https://pro2-bar-s3-cdn-cf3.myportfolio.com/560d16623f9c2df9615744dfab551b3d/e50c016f-b6a8-4666-8fb8-fe6bd5fd9fec_rw_1920.jpeg?h=dc627898fc5eac88aa791fb2b124ecbd",
            imageSource: "https://pro2-bar-s3-cdn-cf3.myportfolio.com/560d16623f9c2df9615744dfab551b3d/e50c016f-b6a8-4666-8fb8-fe6bd5fd9fec_rw_1920.jpeg?h=dc627898fc5eac88aa791fb2b124ecbd"
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
/*
app.get('/', (req, res) => {
    res.send("In Spartan Exam Collection");

});

app.post('/google', (req, res, next) => {
    Profile.findOne({ email: req.body.email })
        .exec()
        .then(docs => {
            if (!docs) {
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    image: req.body.image,
                });
                profile
                    .save()
                    .then(result => {
                        res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });
                        const body = { user: req.body.email };
                        res.status(200).json({

                            email: req.body.email,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            image: req.body.image,
                        });
                    })

                    .catch(err => {
                        console.log(err);
                        res.status(202).json({
                            message: err
                        })
                    })
            }
            else {
                res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                const body = { user: req.body.email };
                res.status(200).json({

                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    image: req.body.image,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(202).json({
                message: err
            })
        })


});


app.post('/upload', function (req, res) {
    let uploadFile = req.files.file;
    const filename = req.files.file.name;
    const professor = req.body.professor;
    const coursename = req.body.coursename;
    const courseid = req.body.courseid;
    const term = req.body.term;
    const year = req.body.year;
    var randomString = "";
    var group = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        randomString += group.charAt(Math.floor(Math.random() * group.length));
    }

    console.log(filename);
    uploadFile.mv(__dirname + '/uploads/' + randomString + `${filename}`);

    var location = "http://localhost:3001/" + randomString + `${filename}`;
    var name = `${filename}`;
    const entry = new uploadExam({
        _id: new mongoose.Types.ObjectId(),
        filelocation: location,
        filename: name,
        courseName: coursename,
        courseID: courseid,
        professor: professor,
        term: term,
        year: year,
    })

    console.log('Data Entered in uploadExam');
    entry.save().then(result => {
        console.log("In File Upload View", res);
        res.status(200).json({
            message: "Paper Successfully Uploaded"
        });
    }).catch(err => console.log(err));

});

app.get('/uploadView', function (req, res) {
    var courseid = req.query.courseid;
    console.log('CourseId in upload view', courseid);
    var query = { courseid: courseid };
    uploadExam.find(query).exec().then(result => {
        console.log("In Upload View", result);
        res.status(200).json(result);
    })
});

app.post('/delete', function (req, res) {
    const { courseid } = req.body;
    var query = { courseid: courseid };
    enrolled.remove(query).exec().then(result => {
        res.status(200).json({
            message: "Successfully Deleted"
        })
    }).catch(err => console.log(err));
})

app.post('/search', (req, res) => {
    const { searchMethod, searchParameter, searchValue, searchYear } = req.query;
    var query;
    if (searchMethod === "courseid") {
        if (searchParameter === ">") {
            var searchNo = searchValue[0];
            searchNo = parseInt(searchNo);
            searchNo = searchNo + 1;
            var searchString = '(' + searchNo;
            for (var i = searchNo + 1; i <= 9; i++) {
                searchString = searchString + '|' + i;
            }
            searchString = searchString + ')';
            var findQuery = '/' + searchString + '.{2}' + '/';
            console.log(searchNo);
            console.log(findQuery);
            query = { courseID: { $regex: eval(findQuery) } };
            executeSearch();

        }
        else if (searchParameter === "<") {
            var searchNo = searchValue[0];
            searchNo = parseInt(searchNo);
            searchNo = searchNo - 1;
            var searchString = '(' + searchNo;
            for (var i = searchNo - 1; i >= 0; i--) {
                searchString = searchString + '|' + i;
            }
            searchString = searchString + ')';
            var findQuery = '/' + searchString + '.{2}' + '/';
            query = { courseID: { $regex: eval(findQuery) } };
            executeSearch();
        }
        else if (searchParameter === "=") {
            var searchNo = searchValue;
            var findQuery = '/' + searchNo + '/';
            query = { courseID: { $regex: eval(findQuery) } };
            executeSearch();
        }
    }

    else if (searchMethod === "professor") {
        var findQuery = '/' + searchValue + '/' + 'i';
        query = { courseName: { $regex: eval(findQuery) } };
        executeSearch();
    }

    else if (searchMethod === "coursename") {
        if (searchParameter === "like") {
            var findQuery = '/' + searchValue + '/' + 'i';
            query = { courseName: { $regex: eval(findQuery) } };
            executeSearch();
        }
        else if (searchParameter === "=") {
            query = { courseName: selectVal };
            executeSearch();
        }
    }

    else if (searchMethod === "term") {
        if (searchParameter === "SP") {
            query = { term: searchParameter, year: searchYear };
            executeSearch();
        }
        else if (searchParameter === "FA") {
            query = { term: searchParameter, year: searchYear };
            executeSearch();
        }
        else if (searchParameter === "SU") {
            query = { term: searchParameter, year: searchYear };
            executeSearch();
        }
    }

    else if (searchMethod === "year") {
        query = { year: searchYear };
        executeSearch();
    }

    function executeSearch() {
        uploadExam.find(query).exec().then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
        })
    }
})
*/
app.listen(3001);
console.log("server running 3001");