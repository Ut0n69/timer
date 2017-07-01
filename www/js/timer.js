var arr = [];
var chkArr = [];
var arrTmp;
var getNowTime;
var left10min = [];

// color
var empty = 'rgba(175, 175, 175, 0.6)';
var used = 'rgba(255, 255, 255, 0)';
var over = 'rgba(255, 68, 68, 1)';
var warnning = 'rgba(255, 241, 15, 0.5)';
var reserved = 'rgba(153, 204, 0, 1)';

var socket = io.connect(location.origin);

/*------------------
    class: StopWatch
------------------*/
var StopWatch = function(_continerId) {
  var self = this;
  this.continerSelecter = "#" + _continerId;
  this.startBtnSelecter = ".startBtn";
  this.stopBtnSelecter = ".stopBtn";
  this.resetBtnSelecter = ".resetBtn";
  this.timerTextSelecter = ".timerText";
  this.defaultInterval = 60000;
  this.timerId = null;

  this.checkStatus = true;

  // テーブル選択
  $(this.continerSelecter).on("tap", function() {

    // 予約
    if ($("#sw").prop("checked")) {

        // 使用中かどうか
        if (self.checkStatus == true) {
          if ($("#sw").prop("checked")) {

            for (var i = 0; i < 1; i++) {

              arr.push(_continerId);
              chkArr = arr.filter(function(x, i, self) {
                return self.indexOf(x) === i && i !== self.lastIndexOf(x);
              });

              if (chkArr.length == 0) {
                $("#" + _continerId).css({
                  'background-color': reserved
                });
              } else {
                $.each(arr, function(i, val) {
                  $("#" + _continerId).css({
                    'background-color': ''
                  });

                  // 重複項目にundefinedを代入
                  if (val == _continerId) {
                    arr[i] = void 0;
                  }
                });
                chkArr.length = 0;
              }

              // undefined埋め
              arrTmp = $.grep(arr, function(e) {
                return e;
              });
              arr = arrTmp;

            }

          } else {
            console.log("SingleTapIsGone");
          }
        } else {
          console.log("DoNotUse");
        }

      // 単体選択
    } else {

      // 座席使用開始
      if (self.checkStatus == true) {

        var tmpText;
        if (this.id == "Prometheus") {
          tmpText = "プロメテウス"
        } else if (this.id == "Nectar") {
          tmpText = "ネクタル"
        } else {
          var text = this.id;
          var tmpText = text.substr(2);
        }

        $.toast({
          text: '開始しました',
          heading: tmpText,
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 1750,
          stack: 5,
          position: 'top-left',

          bgColor: '#444444',
          textColor: '#eeeeee',
          textAlign: 'left',
          beforeShow: function() {},
          afterShown: function() {},
          beforeHide: function() {},
          afterHidden: function() {}
        });

        $("#" + _continerId).css({
          'background-color': used,
          'color': '#000'
        });

        $("#" + _continerId + " .startBtn").hide();
        $("#" + _continerId + " .timerText").show();
        self.stop();
        self.reset();
        self.start();
        self.status();


        // 座席使用終了
      } else {

        var tmpText;
        if (this.id == "Prometheus") {
          tmpText = "プロメテウス"
        } else if (this.id == "Nectar") {
          tmpText = "ネクタル"
        } else {
          var text = this.id;
          var tmpText = text.substr(2);
        }

        modalConf(tmpText);

        $(".conf-edit").on("tap", function() {
          if ($("#" + _continerId).css("background-color") == "rgb(255, 68, 68)") {
            alert("再スタートしてから編集してください")
          } else {
            modalConfEdit(tmpText);
          }

          return false;
        });

        $(".conf-end").on("tap", function() {

          var sendData = {};
          sendData.date = moment().format('YYYYMMDD');
          sendData.endTime = moment().format('HH:mm');
          sendData.tableNum = tmpText;

          // 終了したかどうか
          if ($("#" + _continerId).css("background-color") == "rgb(255, 68, 68)") {
            sendData.stayTime = (120);
          } else {
            sendData.stayTime = (120 - $("#" + _continerId + " .timerText").text());
          }

          // サーバーに情報を送信
          socket.emit("getData", sendData);


          $("#modalConfContents,#modalOverlay").fadeOut("fast", function() {
            $('#modalOverlay').remove();
            $('#modalConfContents').remove();

            var getTime = $("#" + _continerId + " .timerText").text();
            var tmp = ~~getTime;

            self.stop();
            self.reset();
            self.status();
            $("#" + _continerId).css({
              'background-color': '',
              'color': '#fff'
            });
            $("#" + _continerId + " .timerText").hide();
            $("#" + _continerId + " .startBtn").show();

          });

        });

      }

    }

    return false;
  });

};

StopWatch.prototype.status = function() {
  // console.log(this.checkStatus);
};
StopWatch.prototype.start = function() {
  this.run();
};
StopWatch.prototype.stop = function() {
  if (this.timerId !== null) {
    clearInterval(this.timerId);
  }
};
StopWatch.prototype.reset = function() {
  $(this.continerSelecter + ">" + this.timerTextSelecter).text("120");
  var self = this;
  this.checkStatus = true;
};
StopWatch.prototype.run = function() {
  var self = this;
  var timer = this.timerId;
  this.checkStatus = false;
  timer = setInterval(function() {
    var num = $(self.continerSelecter + ">" + self.timerTextSelecter).text();

    if (self.checkStatus == true) {
      clearInterval(timer);
    }

    // 時間切れ
    if (~~num <= 1) {
      $(self.continerSelecter).css({
        'background-color': over,
        'color': '#000'
      });

      if (self.continerSelecter.substr(1) == "Prometheus") {
        $(self.continerSelecter + ">" + self.timerTextSelecter).text("");
      } else if (self.continerSelecter.substr(1) == "Nectar") {
        $(self.continerSelecter + ">" + self.timerTextSelecter).text("");
      } else {
        $(self.continerSelecter + ">" + self.timerTextSelecter).text(self.continerSelecter.substr(3));
      }

      clearInterval(timer);
    } else if (~~num <= 16 && ~~num >= 1) {
      $(self.continerSelecter).css({
        'background-color': warnning,
        'color': '#000'
      });
      $(self.continerSelecter + ">" + self.timerTextSelecter).text(~~num - 1);
      // console.log(self.continerSelecter);
    } else {
      $(self.continerSelecter + ">" + self.timerTextSelecter).text(~~num - 1);
    }

  }, this.defaultInterval);
};


$(function() {

  // インスタンス生成
  var arr = [];
  var str;

  var nectar = new StopWatch("Nectar");
  var prometheus = new StopWatch("Prometheus");

  for (var i = 1; i <= 86; i++) {
    str = String(i);
    arr[i] = new StopWatch("No" + str);
  }


  /*------------------
      jQueryEvents
  ------------------*/
  $("#bg").hide();
  $(".timerText").hide();
  $("#confirm").hide();

  // コピー，右クリック無効
  $('div').css('user-select', 'none').on('copy paste contextmenu', false);

  // スクロール無効
  $(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
  });



  // 座席複数指定の選択検知
  $("#sw").on('tap', function() {
    if ($(this).is(":checked")) {
      // $("#confirm").show();
    } else {
      $.each(arr, function(i, val) {
        // $("#" + val).css({
        //   'background-color': ''
        // });
      });
      arr.length = 0;
      $("#confirm").hide();
    }

    return false;
  });

  // 座席複数指定の確定
  $("#confirm").on("tap", function() {

    $.each(arr, function(i, val) {
      $("#" + val).css({
        'background-color': ''
      });
    });

    $.each(arr, function(i, val) {
      $("#" + val).css({
        'background-color': used
      });
      $("#" + val + " .startBtn").hide();
      $("#" + val + " .timerText").show();
    });

    arr.length = 0;

    return false;
  });

  // ハンバーガーメニュー
  $(".menu").on("tap", function() {
    downMenu();

    return false;
  });


});
