var SQL = {
  "pass": "",
  "databaseName": "timerDB",
  "usr": "root"
};

var WEBHOOK_URL = "";

var LISTEN_PORT = 3000;

const DEFAULT_INTERVAL = 60000;
const DEFAULT_TIME = 120;

var express = require('express');
var mysql = require('mysql');
var socketIO = require("socket.io");
var query;
var tableNum = [];
var timerArr = [];

var app = express();

// wwwディレクトリを静的ファイルディレクトリとして登録
app.use(express.static('www'));

// サーバを開始
var server = app.listen(LISTEN_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('It works!');
});

/*------------------
    MySQL
------------------*/
var dbConfig = {
  host: '127.0.0.1',
  user: SQL.usr,
  password: SQL.pass,
  database: SQL.databaseName,
  port: 3306
};

var dbConnection = mysql.createConnection(dbConfig);


/*------------------
    socket.io
------------------*/
var io = socketIO.listen(server);

// サーバーへのアクセス監視
io.sockets.on("connection", function (socket) {

  socket.emit("webhook", WEBHOOK_URL);

  socket.on("before", function () {
    dbConnection.query('SELECT * FROM status', function (err, rows, fields) {
      if (err) throw err;
      socket.emit("catchStatus", rows);
    });
  })

  socket.on("event", function (data) {
    var status = tableNum[data]._status;
    var num = tableNum[data]._num;

    // 空席 or 予約
    if (status == "empty" || status == "reserve") {
      tableNum[data].start(num);
      // socket.emit("getStatus", status);

      var logDate = new Date();

      var month = logDate.getMonth() + 1;
      var date = logDate.getDate();
      var hour = logDate.getHours();
      var min = logDate.getMinutes();
      var sec = logDate.getSeconds();

      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (min < 10) min = "0" + min;
      if (sec < 10) sec = "0" + sec;


      query = 'insert into log(num, operation, time) values(' + num + ', "開始", "' + month + "/" + date + "/" + " " + hour + ":" + min + ":" + sec + '" );';
      dbConnection.query(query, function (err, rows, fields) {
        if (err) throw err;
      });

      // 使用中
    } else if (status == "use" || status == "warn" || status == "over") {
      // tableNum[data].end(num);
    } else {
      console.log("err");
    }

  });

  socket.on("event-end", function (data) {
    var status = tableNum[data]._status;
    var num = tableNum[data]._num;

    var logDate = new Date();

    var month = logDate.getMonth() + 1;
    var date = logDate.getDate();
    var hour = logDate.getHours();
    var min = logDate.getMinutes();
    var sec = logDate.getSeconds();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    var str = "終了 - " + "番号: " + num + ", 残り時間: " + tableNum[data]._time + ", 操作時刻: " + month + "/" + date + " " + hour + ":" + min + ":" + sec;
    query = 'insert into log(num, operation, time, leftTime) values(' + num + ', "終了", "' + month + "/" + date + "/" + " " + hour + ":" + min + ":" + sec + '" , ' + tableNum[data]._time + ' );';
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });

    tableNum[data].end(num);
  });

  socket.on("event-edit", function (data) {

    var logDate = new Date();

    var month = logDate.getMonth() + 1;
    var date = logDate.getDate();
    var hour = logDate.getHours();
    var min = logDate.getMinutes();
    var sec = logDate.getSeconds();

    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;

    var str = "編集 - " + "番号: " + data.num + ", 編集前: " + tableNum[data.num]._time + ", 編集後: " + data.time + ", 操作時刻: " + month + "/" + date + " " + hour + ":" + min + ":" + sec;
    query = 'insert into log(num, operation, time, beforeEdit, afterEdit) values(' + data.num + ', "編集", "' + month + "/" + date + "/" + " " + hour + ":" + min + ":" + sec + '" , ' + tableNum[data.num]._time + ', ' + data.time + ' );';
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });

    tableNum[data.num].edit(data.num, data.time);

  });

  socket.on("event-reserve", function (data) {
    tableNum[data].reserve(data);
  });

  socket.on("event-reset", function () {

    for (var i = 1; i <= 86; i++) {
      if (tableNum[i].status == "use" || tableNum[i].status == "warn" || tableNum[i].status == "over") {
        tableNum[i].status = "empty";
        tableNum[i].time = DEFAULT_TIME;

        clearInterval(timerArr[i]);
      }
    }

    query = 'update status set status = "empty", time = ' + DEFAULT_TIME;
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });
  });

  // エラーを返す
  socket.on("getErr", function (data) {
    query = 'insert into err(date, name, message ) values("' + data.date + '", "' + data.name + '", "' + data.massage + '");';
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });
  });

  // 操作ログを返す
  socket.on("getLog", function (data) {
    dbConnection.query('SELECT * FROM log', function (err, rows, fields) {
      if (err) throw err;
      socket.emit("catchLog", rows);
    });

  });
});

/*------------------
    リダイレクト
------------------*/
app.get('/info', function (req, res) {
  res.sendFile(__dirname + '/www/info.html');
});

app.get('/api', function (req, res) {
  dbConnection.query('SELECT * FROM status', function (err, rows, fields) {
    if (err) throw err;
    res.send(rows);
  });
});


/*------------------
    タイマー
------------------*/
class Timer {
  constructor(num, time, status) {
    this.num = num;
    this.time = time;
    this.status = status;
  }
  get num() {
    return this._num;
  }
  set num(val) {
    this._num = val;
  }
  get time() {
    return this._time;
  }
  set time(val) {
    this._time = val;
  }
  get status() {
    return this._status;
  }
  set status(val) {
    this._status = val;
  }
  start(num) {
    var num = this.num;
    var timer = this.num;
    tableNum[num].status = "use";

    query = 'update status set status = "use" where num = ' + num;
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });

    timerArr[timer] = setInterval(function () {
      var tmpTime = countDown(num);
      if (tmpTime <= 0) {
        over(num);
        clearInterval(timerArr[num]);
      } else if (tmpTime <= 16) {
        warn(num);
      } else {

      }
    }, DEFAULT_INTERVAL);
  }
  end(num) {
    var num = this.num;
    tableNum[num].status = "empty";
    tableNum[num].time = DEFAULT_TIME;

    clearInterval(timerArr[num]);

    query = 'update status set time = ' + DEFAULT_TIME + ', status = "empty" where num = ' + num;
    dbConnection.query(query, function (err, rows, fields) {
      if (err) throw err;
    });

  }
  edit(num, time) {
    if (tableNum[num].status == "over") {
      tableNum[num].start(num);
      if (time <= 15) {
        tableNum[num].status = "warn";
        tableNum[num].time = time;
        query = 'update status set time = ' + time + ', status = "warn" where num = ' + num;
        dbConnection.query(query, function (err, rows, fields) {
          if (err) throw err;
        });
      } else {
        tableNum[num].status = "use";
        tableNum[num].time = time;
        query = 'update status set time = ' + time + ', status = "use" where num = ' + num;
        dbConnection.query(query, function (err, rows, fields) {
          if (err) throw err;
        });
      }
    } else {
      if (time <= 15) {
        tableNum[num].status = "warn";
        tableNum[num].time = time;
        query = 'update status set time = ' + time + ', status = "warn" where num = ' + num;
        dbConnection.query(query, function (err, rows, fields) {
          if (err) throw err;
        });
      } else {
        tableNum[num].status = "use";
        tableNum[num].time = time;
        query = 'update status set time = ' + time + ', status = "use" where num = ' + num;
        dbConnection.query(query, function (err, rows, fields) {
          if (err) throw err;
        });
      }
    }
  }
  reserve(num) {
    if (tableNum[num].status == "empty") {
      tableNum[num].status = "reserve";
      query = 'update status set status = "reserve" where num = ' + num;
      dbConnection.query(query, function (err, rows, fields) {
        if (err) throw err;
      });
    } else if (tableNum[num].status == "reserve") {
      tableNum[num].status = "empty";
      query = 'update status set status = "empty" where num = ' + num;
      dbConnection.query(query, function (err, rows, fields) {
        if (err) throw err;
      });
    }
  }
  info() {
    console.log("tableNum: " + this.num + "  time: " + this.time + "  status: " + this.status);
  }
}

function countDown(val) {
  tableNum[val].time = tableNum[val]._time - 1;

  query = 'update status set time = ' + tableNum[val].time + ', status = "' + tableNum[val].status + '" where num = ' + tableNum[val].num;
  dbConnection.query(query, function (err, rows, fields) {
    if (err) throw err;
  });

  return tableNum[val].time;
}

function over(val) {
  tableNum[val].status = "over";
  query = 'update status set status = "' + tableNum[val].status + '" where num = ' + tableNum[val].num;
  dbConnection.query(query, function (err, rows, fields) {
    if (err) throw err;
  });
}

function warn(val) {
  tableNum[val].status = "warn";
}

function reset() {
  for (var i = 1; i <= 86; i++) {
    clearInterval(timerArr[i]);
  }
}

// dbから情報を取得してインスタンス生成
dbConnection.query('SELECT * FROM status', function (err, rows, fields) {
  if (err) throw err;

  for (var i = 1; i <= 86; i++) {
    tableNum[i] = new Timer(i, rows[i - 1].time, rows[i - 1].status);
  }

});