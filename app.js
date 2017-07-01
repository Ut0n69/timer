'use strict';

var SQL_PASS = "";
var LISTEN_PORT = 3000;

var express = require('express');
var mysql = require('mysql');
var socketIO = require("socket.io");
var query;

var app = express();

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));

// サーバを開始
var server = app.listen(LISTEN_PORT, function() {
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
  password: SQL_PASS,
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

  });

  socket.on("getHistErr", function() {
    dbConnection.query('SELECT * FROM err', function(err, rows, fields) {
      if (err) throw err;
      socket.emit("toHistErr", rows);
      });

  });


  socket.on("getErr", function(data) {
    query = 'insert into err(date, name, message ) values("' + data.date + '", "' + data.name + '", "' + data.massage + '");';
    dbConnection.query(query, function(err, rows, fields) {
      if (err) throw err;
    });
  });


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

app.get('/timer/hist', function(req, res) {
  res.sendFile(__dirname + '/www/timer-hist.html');
});

app.get('/timer/err', function(req, res) {
  res.sendFile(__dirname + '/www/timer-err.html');
});
