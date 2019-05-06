var express = require('express');

var app = express();

var cors = require('cors');

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors());

var mongoose=require('mongoose');

//MONGODB CONNECT STRING
mongoose.connect('mongodb+srv://canvas:canvas@cluster0-l7vjn.mongodb.net/test?retryWrites=true');
//MONGDB CONNECTION STRING END

var mongoose=require('mongoose');

var uploadExam=require('./models/uploadExam');

var Profile =require('./models/profile');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
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


app.post('/upload',function (req, res){
    let uploadFile = req.files.file
    const filename = req.files.file.name
    // console.log(uploadFile);
    console.log(filename);
    uploadFile.mv('C:/ReactUpload/'+`${filename}`);
    
    var location= "http://localhost:8080/"+`${filename}`;
    var name=`${filename}`;
    const entry = new uploadExam({
      _id: new mongoose.Types.ObjectId(),
      filelocation:location,
      filename:name
    })
  
    console.log('Data Entered in uploadExam');
    entry.save().then(result=>{
      console.log("In File Upload View",res);
      res.send(true);
    }).catch(err=>console.log(err));
  
  });

  app.get('/uploadView',function(req,res){
      var courseid=req.query.courseid;
      console.log('CourseId in upload view',courseid);
      var query={courseid:courseid};
      uploadExam.find(query).exec().then(result=>{
        console.log("In Upload View",result);
        res.json(result);
       })
     });

 app.delete('/delete',function(req,res){
        const {courseid}=req.body;
        var query={courseid:courseid};
        enrolled.remove(query).exec().then(result=>{
        res.send(true);
        }).catch(err=>console.log(err));
      })

app.listen(3001);
console.log("server running 3001");
