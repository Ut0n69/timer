var empty = 'rgb(63, 81, 181)';
var use = 'rgba(255, 255, 255, 0)';
var over = 'rgb(255, 68, 68)';
var warn = 'rgba(255, 241, 15, 0.3)';
var reserve = 'rgb(153, 204, 0)';

var DEFAULT_INTERVAL = 100;
var DEFAULT_TIME = 120;

var socket = io.connect(location.origin);

var URL;
socket.on("webhook", function(data) {
  URL = data;
});

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

// ハンバーガーメニュー
var hbgMenu = function() {

  $('body').prepend(
    '<div class="modal-bg">' +
    '<div class="hbgMenu">' +
    ' <div class="hbgMenu-close">' + '×' + '</div>' +
    ' <div class="hbgMenu-reset">リセット</div>' +
    ' <div class="hbgMenu-des">操作説明</div>' +
    ' <div class="hbgMenu-err">エラー報告</div>' +
    ' <div class="hbgMenu-log">操作ログ</div>' +
    '</div>'
  );

  $(".modal-bg").fadeIn("fast");
  $(".hbgMenu").slideDown("fast");

  $(".modal-bg, .hbgMenu-close").on("tap", function() {
    $(".modal-bg").remove();
    $(".hbgMenu").remove();

    return false;
  });

  $(".hbgMenu-reset").on("tap", function() {
    socket.emit("event-reset");
    location.reload();

    return false;
  });

  $(".hbgMenu-des").on("tap", function() {
    $('body').prepend(
      '<div class="howToUse">' +
      ' <p class="back">×</p>' +
      ' <img class="useImg" src="./images/howToUse.png" />' +
      '</div>'
    );

    $(".modal-bg").remove();
    $(".hbgMenu").remove();

    $(".back").on("tap", function() {
      $(".howToUse").remove();

      return false;
    });

    return false;
  });

  $(".hbgMenu-err").on("tap", function() {

    $(".modal-bg").remove();
    $(".hbgMenu").remove();

    $('body').prepend(
      '<div class="howToUse">' +
      '<p class="back">×</p>' +
      '<div class="err-form">' +
      '<h3>名前</h3>' +
      '<form><input type="text" class="err-form-name" /></form>' +
      '<h3>メッセージ</h3>' +
      '<textarea class="err-form-massage" rows="7" cols="40"></textarea>' +
      '<p>※テーブル番号や時間，どのような不具合が起きたかなど，詳しく書いていただけると助かります...</p>' +
      '<button class="err-form-btn">送信</button>' +
      '</div>' +
      '</div>'
    );

    $(".err-form-btn").on("tap", function() {
      var errData = {};
      errData.date = moment().format('YYYYMMDD HH:mm');
      errData.name = $(".err-form-name").val();
      errData.massage = $(".err-form-massage").val();

      socket.emit("getErr", errData);

      var text = "日付: " + errData.date + "\n名前: " + errData.name + "\nメッセージ： " + errData.massage;
      $.ajax({
        data: 'payload=' + JSON.stringify({
          "text": text
        }),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: URL
      });


      $(".err-form").remove();

      if (errData.name == "") {
        $(".howToUse").append(
          '<div class="err-form">' +
          '<img class="useImg" src="./images/dogeza.png" />' +
          '<h3 class="send-form-text">不具合の報告ありがとうございます！</h3>' +
          '<p>もし，これによりご迷惑をおかけしていましたら，大変申し訳御座いませんでした...</p>' +
          '<p>この不具合はすぐに修正いたします．お手数おかけしました...</p>' +
          '<button class="send-form-back">戻る</button>' +
          '</div>'
        );
      } else {
        $(".howToUse").append(
          '<div class="err-form">' +
          '<p class="send-form-name">' + errData.name + ' さん</p>' +
          '<img class="useImg" src="./images/dogeza.png" />' +
          '<h3 class="send-form-text">不具合の報告ありがとうございます！</h3>' +
          '<p>もし，これによりご迷惑をおかけしていましたら，大変申し訳御座いませんでした...</p>' +
          '<p>この不具合はすぐに修正いたします．お手数おかけしました...</p>' +
          '<button class="send-form-back">戻る</button>' +
          '</div>'
        );
      }

      $(".send-form-back").on("tap", function() {
        $(".howToUse").remove();
        return false;
      });

      return false;
    });

    $(".back").on("tap", function() {
      $(".howToUse").remove();
      return false;
    });
  });

  $(".hbgMenu-log").on("tap", function() {

    // スクロール無効解除
    $(window).off('.noScroll');

    var log;

    $(".modal-bg").remove();
    $(".hbgMenu").remove();

    $('body').prepend(
      '<div class="howToUse">' +
      '<p class="back">×</p>' +
      '<div class="log" style="overflow: scroll; background-color: #fff; widh: 100%; height: 80%; margin: 30px;">' +
      '</div>' +
      '</div>'
    );

    socket.emit("getLog");
    socket.on("catchLog", function(data) {
        log = data;
        for (i in log) {
          $('.log').prepend('<p>' + log[i].log + '</p>');
        }

    });



    $(".err-form-btn").on("tap", function() {
      var errData = {};
      errData.date = moment().format('YYYYMMDD HH:mm');
      errData.name = $(".err-form-name").val();
      errData.massage = $(".err-form-massage").val();

      socket.emit("getErr", errData);

      var text = "日付: " + errData.date + "\n名前: " + errData.name + "\nメッセージ： " + errData.massage;
      $.ajax({
        data: 'payload=' + JSON.stringify({
          "text": text
        }),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: URL
      });


      $(".err-form").remove();

      if (errData.name == "") {
        $(".howToUse").append(
          '<div class="err-form">' +
          '<img class="useImg" src="./images/dogeza.png" />' +
          '<h3 class="send-form-text">不具合の報告ありがとうございます！</h3>' +
          '<p>もし，これによりご迷惑をおかけしていましたら，大変申し訳御座いませんでした...</p>' +
          '<p>この不具合はすぐに修正いたします．お手数おかけしました...</p>' +
          '<button class="send-form-back">戻る</button>' +
          '</div>'
        );
      } else {
        $(".howToUse").append(
          '<div class="err-form">' +
          '<p class="send-form-name">' + errData.name + ' さん</p>' +
          '<img class="useImg" src="./images/dogeza.png" />' +
          '<h3 class="send-form-text">不具合の報告ありがとうございます！</h3>' +
          '<p>もし，これによりご迷惑をおかけしていましたら，大変申し訳御座いませんでした...</p>' +
          '<p>この不具合はすぐに修正いたします．お手数おかけしました...</p>' +
          '<button class="send-form-back">戻る</button>' +
          '</div>'
        );
      }

      $(".send-form-back").on("tap", function() {
        $(".howToUse").remove();
        return false;
      });

      return false;
    });

    $(".back").on("tap", function() {
      $(".howToUse").remove();

      // スクロール無効
      $(window).on('touchmove.noScroll', function(e) {
        e.preventDefault();
      });

      return false;
    });
  });

};


// モーダル
var modal = function(num) {

  $("body").prepend(
    '<div class="modal-bg"></div>' +
    '<div class="modal-contents">' +
    '  <div class="modal-contents-title"></div>' +
    '  <div class="modal-contents-selectar">' +
    '    <div class="modal-contents-edit">編集</div>' +
    '    <div class="modal-contents-end">終了</div>' +
    '  </div>' +
    '</div>'
  );

  var $contents = $(".modal-contents");
  var $bg = $(".modal-bg");

  $(".modal-contents-title").text(num);

  // モーダルの表示
  $contents.fadeIn("fast");
  $bg.fadeIn("fast");

  // カウントダウン終了
  $(".modal-contents-end").on("tap", function() {
    socket.emit("event-end", num);

    $contents.remove();
    $bg.remove();

    return false;
  });

  // 編集
  $(".modal-contents-edit").on("tap", function() {

    $contents.remove();

    $("body").prepend(
      '<div class="modal-edit">' +
      '  <div class="modal-contents-title">' + num + '</div>' +
      '  <div class="modal-contents-selectar">' +
      '     <select class="modal-edit-selectar">' +
      '        <option class="modal-edit-val">120</option>' +
      '      </select>' +
      '  </div>' +
      '   <div class="modal-edit-conf">確定</div>' +
      '</div>'
    );

    for (i = 119; i > 0; i--) {
      $(".modal-edit-selectar").append(
        '<option class="modal-edit-val">' + i + '</option>'
      );
    }

    $(".modal-edit-conf").on("tap", function() {
      var time = $(".modal-edit-selectar option:selected").text();
      var info = {
        "num": num,
        "time": time
      };

      socket.emit("event-edit", info);

      $(".modal-edit").remove();
      $bg.remove();


      return false;
    });

    // 背景タップで閉じる
    $bg.on("tap", function() {
      $(".modal-edit").remove();
      $bg.remove();

      return false;
    });

    return false;
  });


  // 背景タップで閉じる
  $bg.on("tap", function() {
    $contents.remove();
    $bg.remove();

    return false;
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

  // 1ミリ秒毎に更新
  setInterval(function() {
    socket.emit("before");
  }, DEFAULT_INTERVAL);

  // テーブルイベント
  $(".table > *").on("tap", function(e) {

    var num = e.currentTarget.className;
    var bg = $("." + num).css('background-color');

    if ($("#sw").prop("checked")) {
      socket.emit("event-reserve", num.substr(2));
    } else {
      if (bg == use || bg == warn || bg == over) {
        modal(num.substr(2));
      } else if (bg == empty || bg == reserve) {
        socket.emit("event", num.substr(2));
        $.toast({
          text: '開始しました',
          heading: num.substr(2),
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
      } else {
        modal(num.substr(2));
      }
    }

    return false;
  });


  // コピー，右クリック無効
  $('div').css('user-select', 'none').on('copy paste contextmenu', false);

  // スクロール無効
  $(window).on('touchmove.noScroll', function(e) {
    e.preventDefault();
  });

  // ハンバーガーメニュー
  $(".header-menu").on("tap", function() {
    hbgMenu();

    return false;
  });

});
