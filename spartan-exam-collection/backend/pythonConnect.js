const spawn = require("child_process").spawn;
var uploadExam = require('./models/uploadExam');
// const pythonProcess = spawn('python',[process.cwd()+"/pyScript.py"]);

Array.prototype.unique = function () {
    let a = this.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};
let processString = ($text) => {
    var $commonWords = ['i', 'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'com', 'de', 'en', 'for', 'from', 'how', 'in', 'is', 'it', 'la', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'when', 'where', 'who', 'will', 'with', 'und', 'the', 'www'];

    // Convert to lowercase
    $text = $text.toLowerCase();
    // replace unnesessary chars. leave only chars, numbers and space
    $text = $text.replace(/[^\w\d ]/g, '');
    var result = $text.split(' ');
    // remove $commonWords
    result = result.filter(function (word) {
        return $commonWords.indexOf(word) === -1;
    });
    // Unique words
    result = result.unique();
    result = result.map(x => {
        if (!!x) return x;
    });
    return result.join(" ");
}
module.exports =  (filePath, uploadId) => {
    let pythonProcess = spawn('python', [process.cwd() + "/pyScript.py", filePath, uploadId]);
    pythonProcess.stdout.on('data', (data) => {
        data = data.toString();
        data = data.split("\n");
        let filePath = data[0];
        let uId = data[1];
        data.splice(0, 2);
        let tags = processString(data.join(" "));
        console.log("UPDATING", uId, tags)
        uploadExam.findOneAndUpdate({
                uploadId: uId,
            }, {
                tags: tags || ""
            })
            .then(d => console.log(d))
            .catch(e => {
                console.log(e)
            })
    });

}