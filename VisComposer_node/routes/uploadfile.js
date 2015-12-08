var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var router = express.Router();

router.post('/', function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/uploads/';
    form.keepExtensions = true;             //保留后缀格式
    form.maxFieldsSize = 2*1024*1024;       //文件大小
    form.parse(req, function(err, fields, files) {
        var oName = files['datafile'].name;
        var names = oName.split('.');
        var type = files['datafile'].type;
        var date = new Date();
        var ms = Date.parse(date);
        var nName = names[0] + '_' + ms + "." + names[1];
        var newPath = "./public/uploads/" + nName;
        fs.rename(files['datafile'].path, newPath, function(){
            fs.readFile(newPath,'utf-8',function(err,data){
                if(data){
                    if(type === 'text/csv'){
                        res.send(JSON.stringify({
                            "type": type,
                            "data": data,
                            "fileName": nName,
                        }));
                    }
                }else{
                    res.send('Fail to load data');
                }
            });
        });
    });
});

router.get('/list', function(req, res){
    fs.readdir('./public/uploads', function(err, files){
        //console.log(files);
        res.send(files);
    });
});

router.get('/list/:fileName', function(req, res){
    var dir = './public/uploads/';
    var fileName = decodeURIComponent(req.params['fileName']);
    var type = fileName.split('.')[1];
    fs.readFile(dir + fileName, 'utf-8', function(err,data){
        if(data){
            //console.log(data);
            if(type === 'csv'){
                res.send(JSON.stringify({
                    "type": 'text/csv',
                    "data": data,
                    "fileName": fileName,
                }));
            }
        }else{
            res.send('Fail to load data');
        }
    });
});

module.exports = router;
