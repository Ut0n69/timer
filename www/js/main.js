var empty = 'rgb(63, 81, 181)';
var use = 'rgba(255, 255, 255, 0)';
var over = 'rgb(255, 68, 68)';
var warn = 'rgba(255, 241, 15, 0.3)';
var reserve = 'rgb(153, 204, 0)';

var DEFAULT_INTERVAL = 100;
var DEFAULT_TIME = 120;

var socket = io.connect(location.origin);

var URL;
socket.on("webhook", function (data) {
  URL = data;
});

// スタイル変更関数
var setEmpty = function (tableSelectar) {
  $(tableSelectar).css({
    'background-color': "",
    'color': ''
  });
};

var setReserve = function (tableSelectar) {
  $(tableSelectar).css({
    'background-color': reserve,
    'color': '#fff'
  });
};

var setUse = function (tableSelectar) {
  $(tableSelectar).css({
    'background-color': use,
    'color': '#000'
  });
};

var setWarn = function (tableSelectar) {
  $(tableSelectar).css({
    'background-color': warn,
    'color': '#000'
  });
};

var setOver = function (tableSelectar) {
  $(tableSelectar).css({
    'background-color': over,
    'color': '#000'
  });
};

// ハンバーガーメニュー
var hbgMenu = function () {

  $('body').prepend(
    '<div class="modal-bg">' +
    '<div class="hbgMenu">' +
    ' <div class="hbgMenu-close">' + '×' + '</div>' +
    ' <div class="hbgMenu-reset">' +
    ' <img width="80%" src="../images/reset.jpg">' +
    '  <p style="margin: -20px;">リセット</p>' +
    '</div>' +
    ' <div class="hbgMenu-des"><img style="margin: 10px 10px 10px 0" width="84px" height="59px" src="../images/des.jpg"><p style="margin: 17px 0 0 0">操作説明</p></div>' +
    ' <div class="hbgMenu-err"><img style="margin: 5px 3px 10px 3px" width="80px" height="68px" src="../images/err.jpg"><p style="margin: 17px 0 0 0">エラー報告</p></div>' +
    ' <div class="hbgMenu-log"><img style="margin: 2px 6px 10px 6px" width="84px" height="76px" src="../images/log.jpg"><p style="margin: 17px 0 0 0">操作ログ</p></div>' +
    '</div>'
  );

  $(".modal-bg").fadeIn("fast");
  $(".hbgMenu").slideDown("fast");

  $(".modal-bg, .hbgMenu-close").on("tap", function () {
    $(".modal-bg").remove();
    $(".modal-contents").remove();
    $(".hbgMenu").remove();

    return false;
  });

  $(".hbgMenu-reset").on("tap", function () {

    $("body").prepend(
      '<div class="modal-bg"></div>' +
      '<div class="modal-contents">' +
      '  <div style="font-size: 28px;" class="modal-contents-title">リセットしますか？</div>' +
      '  <div class="modal-contents-selectar">' +
      '    <div class="modal-contents-edit reset-no">いいえ</div>' +
      '    <div class="modal-contents-end reset-yes" style="background: #ff9900;">はい</div>' +
      '  </div>' +
      '</div>'
    );

    $(".reset-yes").on("tap", function () {
      $(".modal-contents").remove();
      $(".modal-bg").remove();

      $("body").prepend(
        '<div class="modal-bg" style="background: #000; opacity: 0.8; display: inline"></div>' +
        '<img style="z-index: 10; position: fixed; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%)" src="../images/nowloading.gif">'
      );
      socket.emit("event-reset");

      setTimeout(function () {
        location.reload();
      }, 1000);

      return false;
    });

    $(".reset-no").on("tap", function () {
      $(".modal-bg").remove();
      $(".modal-contents").remove();

      return false;
    });

    $(".hbgMenu").remove();

    return false;
  });

  $(".hbgMenu-des").on("tap", function () {
    $('body').prepend(
      '<div class="howToUse">' +
      ' <p class="back">×</p>' +
      ' <img class="useImg" src="./images/howToUse.png" />' +
      '</div>'
    );

    $(".modal-bg").remove();
    $(".hbgMenu").remove();

    $(".back").on("tap", function () {
      $(".howToUse").remove();

      return false;
    });

    return false;
  });

  $(".hbgMenu-err").on("tap", function () {

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

    $(".err-form-btn").on("tap", function () {
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

      $(".send-form-back").on("tap", function () {
        $(".howToUse").remove();
        return false;
      });

      return false;
    });

    $(".back").on("tap", function () {
      $(".howToUse").remove();
      return false;
    });

    return false;
  });

  $(".hbgMenu-log").on("tap", function () {

    // スクロール無効解除
    $(window).off('.noScroll');

    var log;

    $(".modal-bg").remove();
    $(".hbgMenu").remove();


    $('body').prepend(
      '<div class="howToUse">' +
      '<h2 style="padding: 12px; background: #fff; height: 61px; margin: 0; z-index: 2; width: 100%; text-align: center; font-style: italic; position: fixed; top: 0; left: 50%; transform: translateX(-50%);">操作ログ</h2>' +
      '<p style="z-index: 3; position: fixed; top: 0; left: 0;" class="back">×</p>' +
      '<div class="log" style="overflow-scrolling: touch; -webkit-overflow-scrolling: touch; background-color: #fff; widh: 100%; height: 93%; margin: 62px 5px 5px 5px;">' +
      '<table class="table-header">' +
      '<tr>' +
      '  <th style="width: 77px;">番号</th>' +
      '  <th style="width: 77px;">操作</th>' +
      '  <th style="width: 239px;">操作時間</th>' +
      '  <th style="width: 113px;">残時間</th>' +
      '  <th style="width: 113px;">編集前</th>' +
      '  <th style="width: 113px;">編集後</th>' +
      '</tr>' +
      '</table>' +
      '<div>' +
      '<table class="table-log">' +
      '</table>' +
      '</div>' +
      '</div>' +
      '</div>'
    );

    socket.emit("getLog");
    socket.on("catchLog", function (data) {
      log = data;
      for (i in log) {
        if (log[i].leftTime == null) log[i].leftTime = " - ";
        if (log[i].beforeEdit == null) log[i].beforeEdit = " - ";
        if (log[i].afterEdit == null) log[i].afterEdit = " - ";

        $(".table-log").prepend(
          '  <tr>' +
          '   <td style="width: 77px;">' + log[i].num + '</td>' +
          '   <td style="width: 81px;">' + log[i].operation + '</td>' +
          '   <td style="width: 239px;">' + log[i].time + '</td>' +
          '   <td style="width: 113px;">' + log[i].leftTime + '</td>' +
          '   <td style="width: 113px;">' + log[i].beforeEdit + '</td>' +
          '   <td style="width: 113px;">' + log[i].afterEdit + '</td>' +
          '  </tr>'
        )
      }
    });

    $(".err-form-btn").on("tap", function () {
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

      $(".send-form-back").on("tap", function () {
        $(".howToUse").remove();
        return false;
      });

      return false;
    });

    $(".back").on("tap", function () {
      $(".howToUse").remove();

      // スクロール無効
      $(window).on('touchmove.noScroll', function (e) {
        e.preventDefault();
      });

      return false;
    });

    return false;
  });

};


// モーダル
var modal = function (num) {

  $("body").prepend(
    '<div class="modal-bg"></div>' +
    '<div class="modal-contents">' +
    '  <div class="modal-contents-title"></div>' +
    '  <div class="modal-contents-close" style="color: #fff; font-size: 50px; position: fixed; top: -12px; right: 9px";>×</div>' +
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
  $(".modal-contents-end").on("tap", function () {
    socket.emit("event-end", num);

    $contents.remove();
    $bg.remove();

    return false;
  });

  // 編集
  $(".modal-contents-edit").on("tap", function () {
    var currentNum = $(".no" + num)[0].innerText;

    // スクロール無効解除
    $(window).off('.noScroll');

    $contents.remove();

    $("body").prepend(
      '<div class="modal-edit">' +
      '  <div class="modal-contents-title">' + num + '</div>' +
      '  <div class="modal-contents-close" style="color: #fff; font-size: 50px; position: fixed; top: -12px; right: 9px";>×</div>' +
      '  <div class="modal-contents-selectar">' +
      '    <div class="input-val">' + Number(currentNum) + '</div>' +
      '    <input class="input-range" value="' + Number(currentNum) + '" min="1" max="120" type="range">' +
      '  </div>' +
      '  <div class="modal-edit-conf">確定</div>' +
      '</div>'
    );

    $(".modal-contents-close, .modal-bg").on("tap", function () {

      // スクロール無効
      $(window).on('touchmove.noScroll', function (e) {
        e.preventDefault();
      });

      $(".modal-edit").remove();
      $contents.remove();
      $bg.remove();

      return false;
    });

    $(".input-range").on("input change", function () {
      $(".input-val").text($(".input-range").val());
    });

    $(".modal-edit-conf").on("tap", function () {
      // スクロール無効
      $(window).on('touchmove.noScroll', function (e) {
        e.preventDefault();
      });

      var time = $(".input-range").val();
      var info = {
        "num": num,
        "time": time
      };

      socket.emit("event-edit", info);

      $(".modal-edit").remove();
      $bg.remove();

      return false;
    });

    return false;
  });

  // 背景タップ or ☓ で閉じる
  $(".modal-contents-close, .modal-bg").on("tap", function () {

    // スクロール無効
    $(window).on('touchmove.noScroll', function (e) {
      e.preventDefault();
    });

    $(".modal-edit").remove();
    $contents.remove();
    $bg.remove();

    return false;
  });

};

$(function () {

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
  socket.on("catchStatus", function (data) {
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
  setInterval(function () {
    socket.emit("before");
  }, DEFAULT_INTERVAL);

  // テーブルイベント
  $(".table > *").on("tap", function (e) {

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
          beforeShow: function () {},
          afterShown: function () {},
          beforeHide: function () {},
          afterHidden: function () {}
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
  $(window).on('touchmove.noScroll', function (e) {
    e.preventDefault();
  });

  // ハンバーガーメニュー
  $(".header-menu").on("tap", function () {
    hbgMenu();

    return false;
  });

});