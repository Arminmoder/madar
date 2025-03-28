$(document).ready(function () {
  let resistanceCount1;
  let currentCount1;
  let clickCount;
  clickCount = 0;
  $(".wrapper i").click(function () {
    clickCount++;
    if (clickCount != 0) {
      if (clickCount % 2 == 1) {
        $(".overlay").css({
          animation: "anim1 1.5s linear forwards",
        });
      } else {
        $(".overlay").css({
          animation: "anim2 1.5s linear forwards",
        });
      }
    }
  });
  $("#processInitial").on("click", function () {
    // دریافت مقدار ورودی‌ها
    let nodes = $("#nudeInp").val();
    let resistanceCount = $("#ResistanceInp").val();
    let currentCount = $("#CurrentGeneratorInp").val();
    resistanceCount1 = resistanceCount;
    currentCount1 = currentCount;
    if (nodes != "" && resistanceCount != "" && currentCount != "") {
      $("#slide3").prop("checked", true);
      $(".slide3title").show();
      $(".error3").hide();
      if (Number(resistanceCount) > 9) {
        if (14 >= Number(resistanceCount) && Number(resistanceCount) > 12) {
          $(":root").css("--resistance-count", Number(resistanceCount));
        } else if (
          18 >= Number(resistanceCount) &&
          Number(resistanceCount) > 14
        ) {
          $(":root").css("--resistance-count", Number(resistanceCount) + 1);
        } else if (
          21 >= Number(resistanceCount) &&
          Number(resistanceCount) > 18
        ) {
          $(":root").css("--resistance-count", Number(resistanceCount) + 4);
        } else {
          $(":root").css("--resistance-count", Number(resistanceCount) - 6);
        }
      } else if (currentCount > 9) {
        if (15 >= Number(currentCount) && Number(currentCount) > 12) {
          $(":root").css("--current-count", Number(currentCount) - 3);
        } else if (18 >= Number(currentCount) && Number(currentCount) > 15) {
          $(":root").css("--current-count", Number(currentCount) + 1);
        } else if (21 >= Number(currentCount) && Number(currentCount) > 18) {
          $(":root").css("--current-count", Number(currentCount) + 4);
        } else {
          $(":root").css("--current-count", Number(currentCount) - 5);
        }
      }
    }
    // ذخیره مقادیر در فرم نهایی
    $("#hiddenNodes").val(nodes);
    $("#hiddenResistance").val(resistanceCount);
    $("#hiddenCurrentGenerator").val(currentCount);

    // پاک کردن و ایجاد فیلدهای جدید
    $("#resistanceInputs").empty();
    $("#currentInputs").empty();

    function createInputFields(parent, labelText, namePrefix, count) {
      for (let i = 1; i <= count; i++) {
        let label = $("<label>").text(`${labelText}${i}:`);
        let input = $("<input>")
          .attr("type", "text")
          .attr("name", `${namePrefix}${i}`);
        parent.append($("<div>").append(label, input));
      }
    }

    createInputFields($("#resistanceInputs"), "مقاومت R", "r", resistanceCount);
    createInputFields($("#currentInputs"), "جریان I", "i", currentCount);

    // نمایش فرم دوم
    $("#finalForm").show();
  });

  $("#processFinal").on("click", function () {
    // در اینجا می‌توان اطلاعات را پردازش کرد
    $("#finalForm").submit(); // در صورت نیاز به ارسال به سرور
  });
  let slide = 1;
  let tog = 0;
  $(".next1").click(function () {
    if (tog == 0) {
      slide++;
      if (slide == 4) {
        tog = 1;
        slide = 2;
      }
      if (slide == 3) {
        $(".next1").css("transform", "rotateZ(-90deg)");
      }
    } else {
      slide--;
      if (slide == 1) {
        tog = 0;
        $(".next1").css("transform", "rotateZ(90deg)");
      }
    }
    $("#slide" + slide).prop("checked", true);
  });
  $(document).on("keydown", ".input-field", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // جلوگیری از عملکرد پیش‌فرض
      let inputs = $(".input-field"); // گرفتن همه اینپوت‌ها
      let index = inputs.index(this); // پیدا کردن اینپوت فعال

      if (index !== -1 && index < inputs.length - 1) {
        inputs.eq(index + 1).focus(); // فوکوس روی اینپوت بعدی
      } else {
        $("#processInitial").click(); // کلیک روی دکمه
      }
    }
  });
  $(document).on("keydown", ".inputfinal div div input", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // جلوگیری از عملکرد پیش‌فرض
      let inputs = $(".inputfinal div div input"); // گرفتن همه اینپوت‌ها
      let index = inputs.index(this); // پیدا کردن اینپوت فعال

      if (index !== -1 && index < inputs.length - 1) {
        inputs.eq(index + 1).focus(); // فوکوس روی اینپوت بعدی
      } else {
        $("#processFinal").click(); // کلیک روی دکمه
      }
    }
  });

  let startY = 0;
  let endY = 0;
  let slideT = 1;

  $("body").on("touchstart", function (e) {
    startY = e.originalEvent.touches[0].clientY;
  });
  $("body").on("touchend", function (e) {
    endY = e.originalEvent.changedTouches[0].clientY;
    if (currentCount1 == "undefined" || resistanceCount1 == undefined) {
      if (startY - endY > 50) {
        if (slideT < 3) {
          slideT++;
        }
        $("#slide" + slideT).prop("checked", true);
      } else if (endY - startY > 50) {
        if (slideT > 1) {
          slideT--;
        }
        $("#slide" + slideT).prop("checked", true);
      }
    } else if (currentCount1 < 10 && resistanceCount1 < 10) {
      if (startY - endY > 50) {
        if (slideT < 3) {
          slideT++;
        }
        $("#slide" + slideT).prop("checked", true);
      } else if (endY - startY > 50) {
        if (slideT > 1) {
          slideT--;
        }
        $("#slide" + slideT).prop("checked", true);
      }
    }
  });
});
