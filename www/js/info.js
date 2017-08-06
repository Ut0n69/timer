var empty = 'rgb(63, 81, 181)';
var use = 'rgba(255, 255, 255, 0)';
var over = 'rgb(255, 68, 68)';
var warn = 'rgba(255, 241, 15, 0.3)';
var reserve = 'rgb(153, 204, 0)';

var DEFAULT_INTERVAL = 3000;

var socket = io.connect(location.origin);

// スタイル変更関数
var setEmpty = function(tableSelectar) {
  $(tableSelectar).css({
    'background-color': "",
    'color': ''
  });
};

var setReserve = function(tableSelectar) {
  $(tableSelectar).css({
    'background-color': reserve,
    'color': '#fff'
  });
};

var setUse = function(tableSelectar) {
  $(tableSelectar).css({
    'background-color': use,
    'color': '#000'
  });
};

var setWarn = function(tableSelectar) {
  $(tableSelectar).css({
    'background-color': warn,
    'color': '#000'
  });
};

var setOver = function(tableSelectar) {
  $(tableSelectar).css({
    'background-color': over,
    'color': '#000'
  });
};


$(function() {

  // 座席の生成
  for (i = 1; i <= 86; i++) {
    $(".table").append(
      '<div class="no' + i + '">' +
      ' <div class="timerText"></div>' +
      '</div>'
    );
  }

  // 使ってない座席の消去
  $(".no9").remove();
  $(".no75").remove();
  $(".no85").remove();

  // サーバーから座席情報を取得
  socket.emit("before");
  socket.on("catchStatus", function(data) {
    for (i in data) {

      // 空席
      if (data[i].status == "empty") {
        setEmpty(".no" + data[i].num);
        $(".no" + data[i].num + "> .timerText").text(data[i].num);

        // 予約
      } else if (data[i].status == "reserve") {
        setReserve(".no" + data[i].num);
        $(".no" + data[i].num + "> .timerText").text(data[i].num);

        // 座席使用中
      } else if (data[i].status == "use") {
        setUse(".no" + data[i].num);
        $(".no" + data[i].num + "> .timerText").text(data[i].time);

        // 15分前
      } else if (data[i].status == "warn") {

        setWarn(".no" + data[i].num);
        $(".no" + data[i].num + "> .timerText").text(data[i].time);

        // 時間オーバー
      } else if (data[i].status == "over") {
        setOver(".no" + data[i].num);
        $(".no" + data[i].num + "> .timerText").text(data[i].num);

      } else {
        alert(data[i].status + "  -  " + data[i].num)
      }

    }
  });

  // 3秒毎に更新
  setInterval(function() {
    socket.emit("before");
  }, DEFAULT_INTERVAL);

  // コピー，右クリック無効
  $('div').css('user-select', 'none').on('copy paste contextmenu', false);

});
