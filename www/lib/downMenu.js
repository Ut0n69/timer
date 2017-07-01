function downMenu(val) {

  $('body').prepend(
    '<div id="downMenuContents">' +
    '<div class="bg"><p class="menuClose" id="downMenuClose">' + '×' + '</p></div>' +
    '<div class="menuTitle">滞在時間はかる君</div>' +
    '<div class="menuReset">リセット</div>' +
    '<div class="menuDes">操作説明</div>' +
    '<div class="menuErr">エラー報告</div>' +
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

  $(".menuDes").on("tap", function() {
    $('body').prepend(
      '<div id="howToUse">' +
      '<p class="back">×</p>' +
      '<img class="useImg" src="./images/howToUse.png" />' +
      '</div>'
    );

    $("#downMenuOverlay").fadeOut("fast", function() {
      $('#downMenuOverlay').remove();
    });
    $("#downMenuContents").fadeOut("fast", function() {
      $('#downMenuContents').remove();
    });
    $("#howToUse").fadeIn("fast", function() {
      $("#howToUse").show();
    });

    $(".back").on("tap", function() {
      $("#howToUse").fadeOut("fast", function() {
        $("#howToUse").remove();
      });

      return false;
    });


    return false;
  });

  // エラー報告
  $(".menuErr").on("tap", function() {

    $('body').prepend(
      '<div id="howToUse">' +
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

    $(".back").on("tap", function() {
      $("#howToUse").fadeOut("fast", function() {
        $("#howToUse").remove();
      });

      return false;
    });

    $(".err-form-btn").on("tap", function() {
      var errData = {};
      errData.date = moment().format('YYYYMMDD HH:mm');
      errData.name = $(".err-form-name").val();
      errData.massage = $(".err-form-massage").val();

      socket.emit("getErr", errData);

      $(".err-form").remove();

      if (errData.name == "") {
        $("#howToUse").append(
          '<div class="err-form">' +
          '<img class="useImg" src="./images/dogeza.png" />' +
          '<h3 class="send-form-text">不具合の報告ありがとうございます！</h3>' +
          '<p>もし，これによりご迷惑をおかけしていましたら，大変申し訳御座いませんでした...</p>' +
          '<p>この不具合はすぐに修正いたします．お手数おかけしました...</p>' +
          '<button class="send-form-back">戻る</button>' +
          '</div>'
        );
      } else {
        $("#howToUse").append(
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
        $("#howToUse").fadeOut("fast", function() {
          $("#howToUse").remove();
        });

        return false;
      });

      return false;
    });


    $("#downMenuOverlay").fadeOut("fast", function() {
      $('#downMenuOverlay').remove();
    });
    $("#downMenuContents").fadeOut("fast", function() {
      $('#downMenuContents').remove();
    });

    return false;
  });



  // コンテンツをフェードインする
  $("#downMenuContents").slideDown("fast");

  $("#downMenuOverlay,#downMenuClose,.menuClose").unbind().on("tap", function() {
    $("#downMenuOverlay").fadeOut("fast", function() {
      $('#downMenuOverlay').remove();
    });
    $("#downMenuContents").slideUp("fast", function() {
      $('#downMenuContents').remove();
    });

    return false;
  });


}
