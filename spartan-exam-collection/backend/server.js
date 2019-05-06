var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var mongoose = require('mongoose');
var uploadExam = require('./models/uploadExam');
var Profile = require('./models/profile');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());


//MONGODB CONNECT STRING
mongoose.connect('mongodb+srv://spartan:spartan@cluster0-bduua.mongodb.net/test?retryWrites=true');
//MONGDB CONNECTION STRING END


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

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

    for (var i = 0; i < 5; i++){
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

app.listen(3001);
console.log("server running 3001");
