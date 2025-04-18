$(document).ready(function () {
  let resistanceCount1;
  let currentCount1;
  let clickCount;
  clickCount = 0;
  // Hamburger bar top left
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
  // Making the second form
  $("#processInitial").on("click", function () {
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
        if (currentCount > 9) {
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
      } else {
        $(":root").css("--current-count", 0);
        $(":root").css("--resistance-count", 0);
      }
    }
    $("#hiddenNodes").val(nodes);
    $("#hiddenResistance").val(resistanceCount);
    $("#hiddenCurrentGenerator").val(currentCount);
    $("#resistanceInputs").empty();
    $("#currentInputs").empty();
    function toEnglishDigits(str) {
      return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    }
    function createInputFields(parent, labelText, namePrefix, count) {
      const examples = [
        "ورودی: 1 2 30",
        "ورودی: 2 0 10",
        "ورودی: 0 1 20",
        "ورودی: 3 4 5",
        "ورودی: 5 6 10",
        "ورودی: 7 6 15",
        "ورودی: 1 4 5",
      ];
      for (let i = 1; i <= count; i++) {
        let randomExample =
          examples[Math.floor(Math.random() * examples.length)];
        let label = $("<label>").text(`${labelText}${i}:`);
        let input = $("<input>")
          .attr("type", "text")
          .attr("name", `${namePrefix}${i}`)
          .attr("pattern", "^-?\\d+\\s+-?\\d+\\s+-?\\d+(\\.\\d+)?$")
          .attr("title", "لطفاً سه عدد را با فاصله وارد کنید. مثل: 10 2 3")
          .attr("placeholder", randomExample)
          .attr("required", true);
        input.on("input", function () {
          this.value = toEnglishDigits(this.value);
        });
        parent.append($("<div>").append(label, input));
      }
    }
    createInputFields($("#resistanceInputs"), "مقاومت R", "r", resistanceCount);
    createInputFields($("#currentInputs"), "جریان I", "i", currentCount);
    $("#finalForm").show();
  });
  // Loading and sending data
  $("#processFinal").on("click", function () {
    $(".load").css("z-index", "9999");
    $(".load").show();
    function getRandomEquation() {
      let a = Math.floor(Math.random() * 100) + 1;
      let b = Math.floor(Math.random() * 100) + 1;
      let op = ["+", "-", "×", "÷"][Math.floor(Math.random() * 4)];
      let equation = `${a} ${op} ${b} = `;
      let result =
        op === "÷"
          ? (a / b).toFixed(2)
          : op === "×"
          ? a * b
          : op === "+"
          ? a + b
          : a - b;
      return { equation, result };
    }

    function updateEquation() {
      let mathProblem = getRandomEquation();
      $("#equation").text(mathProblem.equation);
      $("#result").text("");

      setTimeout(() => {
        $("#result").text(`${mathProblem.result}`);
      }, 1000);
    }

    $(document).ready(function () {
      updateEquation();
      setInterval(updateEquation, 2000);
    });
    const form = document.getElementById("finalForm");

    if (form.checkValidity()) {
      form.submit();
    } else {
      form.reportValidity();
      $(".load").hide();
    }
  });
  // Slide change button bottom right
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
  // Changing slides with touch on the phone
  $(document).on("keydown", ".input-field", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let inputs = $(".input-field");
      let index = inputs.index(this);

      if (index !== -1 && index < inputs.length - 1) {
        inputs.eq(index + 1).focus();
      } else {
        $("#processInitial").click();
      }
    }
  });
  $(document).on("keydown", ".inputfinal div div input", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      let inputs = $(".inputfinal div div input");
      let index = inputs.index(this);

      if (index !== -1 && index < inputs.length - 1) {
        inputs.eq(index + 1).focus();
      } else {
        $("#processFinal").click();
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
