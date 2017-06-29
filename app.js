'use strict';

var express = require('express');
var mysql = require('mysql');
var socketIO = require("socket.io");
var query;

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
    MySQL
------------------*/
var dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '<<<<<PASSWORD>>>>>',
  database: 'timerDB',
  port: 3306
};

var dbConnection = mysql.createConnection(dbConfig);


/*------------------
    socket.io
------------------*/
var io = socketIO.listen(server);

// サーバーへのアクセス監視
io.sockets.on("connection", function(socket) {

  socket.on("getData", function(data) {

    console.log(data);

    query = 'insert into hist(date, tableNum, stayTime, endTime ) values("' + data.date + '", "' + data.tableNum + '", "' + data.stayTime + '", "' + data.endTime + '");';
    dbConnection.query(query, function(err, rows, fields) {
      if (err) throw err;
    });

  });

  socket.on("getHist", function() {
    dbConnection.query('SELECT * FROM hist', function(err, rows, fields) {
      if (err) throw err;
      socket.emit("toHist", rows);
      });

  })

});

/*------------------
    リダイレクト
------------------*/
app.get('/timer', function(req, res) {
  res.sendFile(__dirname + '/www/timer.html');
});

app.get('/manager', function(req, res) {
    res.sendFile(__dirname + '/www/manager.html');
});

app.get('/timer/api', function(req, res) {
  res.sendFile(__dirname + '/www/timer-hist.html');
});
