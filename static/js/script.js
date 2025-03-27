$(document).ready(function () {
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
    $("#slide3").prop("checked", true);
    $(".slide3title").show();
    $(".error3").hide();
    // دریافت مقدار ورودی‌ها
    let nodes = $("#nudeInp").val();
    let resistanceCount = $("#ResistanceInp").val();
    let currentCount = $("#CurrentGeneratorInp").val();

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
  let x = 1;
  let p = 0;
  $(".next1").click(function () {
    if (p == 0) {
      x++;
      if (x == 4) {
        p = 1;
        x = 2;
      }
      if (x == 3) {
        $(".next1").css("transform", "rotateZ(-90deg)");
      }
    } else {
      x--;
      if (x == 1) {
        p = 0;
        $(".next1").css("transform", "rotateZ(90deg)");
      }
    }
    $("#slide" + x).prop("checked", true);
  });
});
