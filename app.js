'use strict';

var express = require('express');
var app = express();

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));

// サーバを開始
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('It works!');
});



/*------------------
    リダイレクト
------------------*/
// app.get('/map', function(req, res) {
//     res.sendFile(__dirname + '/www/map.html');
// });
//
// app.get('/management', function(req, res) {
//     res.sendFile(__dirname + '/www/management.html');
// });
