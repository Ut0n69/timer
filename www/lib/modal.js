function centering() {

  var w = $(window).width();
  var h = $(window).height();

  var cw = $("#modalContents, #modalConfContents, #modalConfEdit").outerWidth();
  var ch = $("#modalContents, #modalConfContents, #modalConfEdit").outerHeight();

  //センタリングを実行する
  $("#modalContents, #modalConfContents, #modalConfEdit").css({
    "left": ((w - cw) / 2) + "px",
    "top": ((h - ch) / 2) + "px"
  });

}

function modalConf(data) {

  $('body').prepend(
  '<div id="modalConfContents">' +
    '<p class="conf-data">' + data + '</p>' +
    '<div class="conf-btn">' +
    '<button class="conf-edit">編集</button>' +
    '<button class="conf-end">終了</button>' +
    '</div>' +
  '</div>'
  );

  $(this).blur();
  if ($("#modalOverlay")[0]) return false;

  // オーバーレイを出現させる
  $("body").append('<div id="modalOverlay"></div>');
  $("#modalOverlay").fadeIn("fast");

  centering();

  // コンテンツをフェードインする
  $("#modalConfContents").fadeIn("fast");

  $("#modalOverlay,#modalClose").unbind().click(function() {
    $('#modalConfContents').remove();
    $("#modalConfContents,#modalOverlay").fadeOut("fast", function() {
      $('#modalOverlay').remove();
    });
  });

  $(window).resize(centering);

}

function modalConfEdit(data) {

  $('#modalConfContents').remove();

  $('body').prepend(
  '<div id="modalConfEdit">' +
    '<p class="conf-data">' + data + '</p>' +
    '<label class="select-wrap entypo-down-open-mini">' +
    '<select class="conf-selecter" name="category">' +
    '<option value="120" selected>120</option>' +
    '</select>' +
    '</label>' +
    '<br />' +
    '<button class="conf-ok">確定</button>' +
    '</div>'
  );

  for (i = 119; i > 0; i--) {
    $(".conf-selecter").append(
      '<option value="' + i + '">' + i + '</option>'
    );
  }

  $(".conf-ok").on("tap", function() {

    var val = $(".conf-selecter").val();

    if (data == "プロメテウス") {
      var tmp = '#Prometheus';
    } else if (data == "ネクタル") {
      var tmp = '#Nectar';
    } else {
      var tmp = '#No' + data;
    }

    // 編集ボタンログーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var hash = {};
    hash.status = "edit";
    hash.tableNum = data;
    hash.before = $(tmp + "> .timerText").text();
    hash.after = val;
    hash.date = moment().format('MM/DD');
    hash.time = moment().format('HH:mm:ss');
    socket.emit("log", hash);
    // 編集ボタンログーーーーーーーーーーーーーーーーーーーーーーーーーーーー


    $(tmp + "> .timerText").text(val);

    $('#modalConfEdit').remove();
    $("#modalConfContents,#modalOverlay").fadeOut("fast", function() {
      $('#modalOverlay').remove();
    });


    return false;
  });

  centering();

  // コンテンツをフェードインする
  $("#modalConfEdit").fadeIn("fast");

  $("#modalOverlay,#modalClose").unbind().click(function() {
    $('#modalConfEdit').remove();
    $("#modalConfContents,#modalOverlay").fadeOut("fast", function() {
      $('#modalOverlay').remove();
    });
  });

  $(window).resize(centering);

}
