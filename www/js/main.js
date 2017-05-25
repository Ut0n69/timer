var arr = [];
var chkArr = [];
var arrTmp;

var date = moment().format('YYYYMMDD');

// color
var empty = 'rgba(175, 175, 175, 0.6)';
var used = 'rgba(255, 255, 255, 0)';
var over = 'rgba(255, 0, 0, 0.6)';
var beer = 'rgba(255, 241, 15, 1)';
var reserved = 'rgba(171, 255, 127, 1)';

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
  this.defaultInterval = 1000;
  this.timerId = null;

  this.checkStatus = true;

  // テーブル選択
  $(this.continerSelecter).on("taphold", function() {

    // 複数選択
    if ($("#switch-2").prop("checked")) {

      for (var i = 0; i < 1; i++) {

        if (self.checkStatus == false) {
          console.log("do not use");
          $.each(arr, function(i, val) {
            console.log(val);
          });
          // break;
        }

        arr.push(_continerId);
        chkArr = arr.filter(function(x, i, self) {
          return self.indexOf(x) === i && i !== self.lastIndexOf(x);
        });

        self.stop();
        self.reset();
        self.start();

        if (chkArr.length == 0) {
          $("#" + _continerId).css({
            'background-color': empty
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

      console.log(arr);

      // 単体選択
    } else {

      // 座席使用開始
      if (self.checkStatus == true) {

        $("#" + _continerId).css({
          'background-color': used
        });

        $("#" + _continerId + " .startBtn").hide();
        $("#" + _continerId + " .timerText").show();
        self.stop();
        self.reset();
        self.start();
        self.status();

        // swal({
        //         title: _continerId + " を使用しますか？",
        //         text: "",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#3f51b5",
        //         confirmButtonText: "Yes",
        //         closeOnConfirm: true
        //     },
        //     function() {
        //
        //         $("#" + _continerId).css({
        //             'background-color': used
        //         });
        //         $("#" + _continerId + " .startBtn").hide();
        //         $("#" + _continerId + " .timerText").show();
        //         self.stop();
        //         self.reset();
        //         self.start();
        //         self.status();
        //     }
        // );

        // 座席使用終了
      } else {

        var getTime = $("#" + _continerId + " .timerText").text();
        var tmp = ~~getTime;

        self.stop();
        self.reset();
        self.status();
        $("#" + _continerId).css({
          'background-color': ''
        });
        $("#" + _continerId + " .timerText").hide();
        $("#" + _continerId + " .startBtn").show();

        // swal({
        //         title: _continerId + " 終了しますか？",
        //         text: "",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#3f51b5",
        //         confirmButtonText: "Yes",
        //         closeOnConfirm: true
        //     },
        //     function() {
        //
        //         var getTime = $("#" + _continerId + " .timerText").text();
        //         var tmp = ~~getTime;
        //
        //         self.stop();
        //         self.reset();
        //         self.status();
        //         $("#" + _continerId).css({
        //             'background-color': '',
        //             'opacity': ''
        //         });
        //         $("#" + _continerId + " .timerText").hide();
        //         $("#" + _continerId + " .startBtn").show();
        //     }
        // );

      }

    }

    return false;
  });

  $(this.continerSelecter + ">" + this.stopBtnSelecter).on("tap", function() {
    self.stop();
    return false;
  });
  $(this.continerSelecter + ">" + this.resetBtnSelecter).on("tap", function() {
    self.reset();
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
  this.checkStatus = false;
  this.timerId = setInterval(function() {
    var num = $(self.continerSelecter + ">" + self.timerTextSelecter).text();
    $(self.continerSelecter + ">" + self.timerTextSelecter).text(~~num - 1);
  }, this.defaultInterval);
};


$(function() {

  var no1 = new StopWatch("No1");
  var no2 = new StopWatch("No2");
  var no3 = new StopWatch("No3");
  var no4 = new StopWatch("No4");
  var no5 = new StopWatch("No5");
  var no6 = new StopWatch("No6");
  var no7 = new StopWatch("No7");
  var no8 = new StopWatch("No8");
  var no10 = new StopWatch("No10");
  var no11 = new StopWatch("No11");
  var no12 = new StopWatch("No12");
  var no13 = new StopWatch("No13");
  var no14 = new StopWatch("No14");
  var no15 = new StopWatch("No15");
  var no16 = new StopWatch("No16");
  var no17 = new StopWatch("No17");
  var no18 = new StopWatch("No18");
  var no19 = new StopWatch("No19");
  var no20 = new StopWatch("No20");
  var no21 = new StopWatch("No21");
  var no22 = new StopWatch("No22");
  var no23 = new StopWatch("No23");
  var no24 = new StopWatch("No24");
  var no25 = new StopWatch("No25");
  var no26 = new StopWatch("No26");
  var no27 = new StopWatch("No27");
  var no28 = new StopWatch("No28");
  var no29 = new StopWatch("No29");
  var no30 = new StopWatch("No30");
  var no31 = new StopWatch("No31");
  var no32 = new StopWatch("No32");
  var no33 = new StopWatch("No33");
  var no34 = new StopWatch("No34");
  var no35 = new StopWatch("No35");
  var no36 = new StopWatch("No36");
  var no37 = new StopWatch("No37");
  var no38 = new StopWatch("No38");
  var no39 = new StopWatch("No39");
  var no40 = new StopWatch("No40");
  var no41 = new StopWatch("No41");
  var no42 = new StopWatch("No42");
  var no43 = new StopWatch("No43");
  var no44 = new StopWatch("No44");
  var no45 = new StopWatch("No45");
  var no46 = new StopWatch("No46");
  var no47 = new StopWatch("No47");
  var no48 = new StopWatch("No48");
  var no49 = new StopWatch("No49");
  var no50 = new StopWatch("No50");
  var no51 = new StopWatch("No51");
  var no52 = new StopWatch("No52");
  var no53 = new StopWatch("No53");
  var no54 = new StopWatch("No54");
  var no55 = new StopWatch("No55");
  var no56 = new StopWatch("No56");
  var no57 = new StopWatch("No57");
  var no58 = new StopWatch("No58");
  var no59 = new StopWatch("No59");
  var no60 = new StopWatch("No60");
  var no61 = new StopWatch("No61");
  var no62 = new StopWatch("No62");
  var no63 = new StopWatch("No63");
  var no64 = new StopWatch("No64");
  var no65 = new StopWatch("No65");
  var no66 = new StopWatch("No66");
  var no67 = new StopWatch("No67");
  var no68 = new StopWatch("No68");
  var no69 = new StopWatch("No69");
  var no70 = new StopWatch("No70");
  var no71 = new StopWatch("No71");
  var no72 = new StopWatch("No72");
  var no73 = new StopWatch("No73");
  var nectar = new StopWatch("Nectar");
  var no76 = new StopWatch("No76");
  var no77 = new StopWatch("No77");
  var no78 = new StopWatch("No78");
  var no79 = new StopWatch("No79");
  var no80 = new StopWatch("No80");
  var no81 = new StopWatch("No81");
  var no82 = new StopWatch("No82");
  var no83 = new StopWatch("No83");
  var prometheus = new StopWatch("Prometheus");
  var no86 = new StopWatch("No86");



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
  $("#switch-2").on('tap', function() {
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

    return false;e
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

});
