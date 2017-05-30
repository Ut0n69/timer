function centering() {

  var w = $(window).width();
  var h = $(window).height();

  var cw = $("#modalContents").outerWidth();
  var ch = $("#modalContents").outerHeight();

  //センタリングを実行する
  $("#modalContents").css({
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
