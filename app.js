'use strict';

var express = require('express');
var mysql = require('mysql');
var socketIO = require("socket.io");

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
app.get('/timer', function(req, res) {
    res.sendFile(__dirname + '/www/timer.html');
});

// app.get('/manager', function(req, res) {
//     res.sendFile(__dirname + '/www/manager.html');
// });


/*------------------
    MySQL
------------------*/
// var dbConfig = {
//     host: '127.0.0.1',
//     user: 'root',
//     password: '<<<<<PASSWORD>>>>>',
//     database: 'timerDB',
//     port: 3306
// };
//
// var dbConnection = mysql.createConnection(dbConfig);
//
// app.get('/hall', function(req, res) {
//
//     // MySQLデータベースからデータのリストを取得
//     dbConnection.query('SELECT * FROM hall', function(err, rows, fields) {
//         if (err) throw err;
//         res.send(rows);
//     });
//
// });


/*------------------
    socket.io
------------------*/
var io = socketIO.listen(server);

// サーバーへのアクセス監視
io.sockets.on("connection", function(socket) {

    socket.on("getData", function(data) {

      console.log(data);


    //   if (data.status == 0) {
    //     queryTmp = 'insert into hist values ("' + data.name + '", "' + data.date + '", "' + data.time + '", "", "", "")';
    //   } else if (data.status == 1) {
    //     queryTmp = 'update hist set rest_start = "' + data.time + '" where name = "' + data.name + '" and date = "' + data.date + '"';
    //   } else if (data.status == 2) {
    //     queryTmp = 'update hist set rest_end = "' + data.time + '" where name = "' + data.name + '" and date = "' + data.date + '"';
    //   } else if (data.status == 3) {
    //     queryTmp = 'update hist set work_end = "' + data.time + '" where name = "' + data.name + '" and date = "' + data.date + '"';
    //   } else {
    //     console.log("err");
    //   }
    //   dbConnection.query(queryTmp, function(err, rows, fields) {
    //       if (err) throw err;
    //       console.log(rows);
    //   });
   });

});
