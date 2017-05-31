function downMenu(val) {

  $('body').prepend(
    '<div id="downMenuContents">' +
    '<div class="bg"><p class="menuClose" id="downMenuClose">' + '☓' + '</p></div>' +
    '<p class="menuTitle">滞在時間はかる君</p>' +
    '<p class="menuReset">リセット</p>' +
    '<p class="menuDes">機能説明(未実装)</p>' +
    '</div>'
  );

  $(this).blur();
  if ($("#downMenuOverlay")[0]) return false;

  // オーバーレイを出現させる
  $("body").append('<div id="downMenuOverlay"></div>');
  $("#downMenuOverlay").fadeIn("fast");

  // コンテンツをセンタリングする
  var w = $(window).width();
  var cw = $("#downMenuContents").outerWidth();

  //センタリングを実行する
  $("#downMenuContents").css({
    "left": ((w - cw) / 2) + "px"
  });

  $(".menuReset").on("tap", function() {
    location.reload();

    return false;
  });

  // コンテンツをフェードインする
  $("#downMenuContents").slideDown("fast");

  $("#downMenuOverlay,#downMenuClose,.menuClose").unbind().click(function() {
    $("#downMenuOverlay").fadeOut("fast", function() {
      $('#downMenuOverlay').remove();
    });
    $("#downMenuContents").slideUp("fast", function() {
      $('#downMenuContents').remove();
    });

  });

  $(window).resize(centering);

}
