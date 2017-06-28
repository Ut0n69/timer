function centering() {

  var w = $(window).width();
  var h = $(window).height();

  var cw = $("#modalContents, #modalConfContents").outerWidth();
  var ch = $("#modalContents, #modalConfContents").outerHeight();

  //センタリングを実行する
  $("#modalContents, #modalConfContents").css({
    "left": ((w - cw) / 2) + "px",
    "top": ((h - ch) / 2) + "px"
  });

}

function modal() {

  $('body').prepend(
  '<div id="modalContents">' +
    '<p>' + 'リセットしますか？' + '</p>' +
    '<p><a class="reload">リセット</a></p>' +
    '<p><a id="modalClose" class="buttonLink">キャンセル</a></p>' +
  '</div>'
  );

  $(this).blur();
  if ($("#modalOverlay")[0]) return false;

  // オーバーレイを出現させる
  $("body").append('<div id="modalOverlay"></div>');
  $("#modalOverlay").fadeIn("normal");

  // コンテンツをセンタリングする
  centering();

  // コンテンツをフェードインする
  $("#modalContents").fadeIn("normal");

  $("#modalOverlay,#modalClose").unbind().click(function() {
    $("#modalContents,#modalOverlay").fadeOut("normal", function() {
      $('#modalOverlay').remove();
      $('#modalContents').remove();
    });
  });

  $(".reload").on("tap", function() {
    location.reload();
  });

  $(window).resize(centering);

}

function modalConf(data) {

  $('body').prepend(
  '<div id="modalConfContents">' +
    '<p class="conf-data">' + data + '</p>' +
    '<div class="conf-btn">' +
    '<button id="modalClose" class="conf-cancel">キャンセル</button>' +
    '<button class="conf-end">終了</button>' +
    '</div>' +
  '</div>'
  );

  $(this).blur();
  if ($("#modalOverlay")[0]) return false;

  // オーバーレイを出現させる
  $("body").append('<div id="modalOverlay"></div>');
  $("#modalOverlay").fadeIn("fast");

  // コンテンツをセンタリングする
  centering();

  // コンテンツをフェードインする
  $("#modalConfContents").fadeIn("fast");

  $("#modalOverlay,#modalClose").unbind().click(function() {
    $("#modalConfContents,#modalOverlay").fadeOut("fast", function() {
      $('#modalOverlay').remove();
      $('#modalConfContents').remove();
    });
  });


  $(window).resize(centering);

}
