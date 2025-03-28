$(document).ready(function () {
  $(".circle").click(function () {
    if ($(".container").attr("class") == "container active") {

      $(".container").removeClass("active");
      $(".container").addClass("dactive");

    } else {
      $(".container").removeClass("dactive");

      $(".container").addClass("active");
    }
  });
});
