$(document).ready(function () {
  var inputs = document.querySelectorAll(".inputfile");
  Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener("change", function (e) {
      var fileName = "";
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute("data-multiple-caption") || "").replace(
          "{count}",
          this.files.length
        );
      else fileName = e.target.value.split("\\").pop();

      if (fileName) {
        label.querySelector("span").innerHTML = fileName;

        let reader = new FileReader();
        reader.onload = function () {
          let dataURL = reader.result;
          $("#selected-image").attr("src", dataURL);
          $("#selected-image").addClass("col-12");
        };
        let file = this.files[0];
        reader.readAsDataURL(file);
        startRecognize(file);
      } else {
        label.innerHTML = labelVal;
        $("#selected-image").attr("src", "");
        $("#selected-image").removeClass("col-12");
        $("#arrow-right").addClass("fa-arrow-right");
        $("#arrow-right").removeClass("fa-check");
        $("#arrow-right").removeClass("fa-spinner fa-spin");
        $("#arrow-down").addClass("fa-arrow-down");
        $("#arrow-down").removeClass("fa-check");
        $("#arrow-down").removeClass("fa-spinner fa-spin");
        $("#log").empty();
      }
    });

    // Firefox bug fix
    input.addEventListener("focus", function () {
      input.classList.add("has-focus");
    });
    input.addEventListener("blur", function () {
      input.classList.remove("has-focus");
    });
  });
});

$("#startLink").click(function () {
  var img = document.getElementById("selected-image");
  startRecognize(img);
});

function startRecognize(img) {
  $("#arrow-right").removeClass("fa-arrow-right");
  $("#arrow-right").addClass("fa-spinner fa-spin");
  $("#arrow-down").removeClass("fa-arrow-down");
  $("#arrow-down").addClass("fa-spinner fa-spin");
  recognizeFile(img);
}

// function progressUpdate(packet) {
//   var log = document.getElementById("log");

//   if (log.firstChild && log.firstChild.status === packet.status) {
//     if ("progress" in packet) {
//       var progress = log.firstChild.querySelector("progress");
//       progress.value = packet.progress;
//     }
//   } else {
//     var line = document.createElement("div");
//     line.status = packet.status;
//     var status = document.createElement("div");
//     status.className = "status";
//     status.appendChild(document.createTextNode(packet.status));
//     line.appendChild(status);

//     if ("progress" in packet) {
//       var progress = document.createElement("progress");
//       progress.value = packet.progress;
//       progress.max = 1;
//       line.appendChild(progress);
//     }

//     if (packet.status == "done") {
//       log.innerHTML = "";
//       var pre = document.createElement("pre");
//       pre.appendChild(
//         document.createTextNode(packet.data.text.replace(/\n\s*\n/g, "\n"))
//       );
//       line.innerHTML = "";
//       line.appendChild(pre);
//       $(".fas").removeClass("fa-spinner fa-spin");
//       $(".fas").addClass("fa-check");
//     }

//     log.insertBefore(line, log.firstChild);
//   }
// }
var dollar = "$";
function recognizeFile(file) {
  $("#log").empty();
  const corePath =
    window.navigator.userAgent.indexOf("Edge") > -1
      ? "js/tesseract-core.asm.js"
      : "js/tesseract-core.wasm.js";

  const worker = new Tesseract.TesseractWorker({
    corePath,
  });

  worker
    .recognize(file, $("#langsel").val())
    .progress(function (packet) {
      //   console.info(packet);
      //   progressUpdate(packet);
    })
    .then(function (data) {
      //   console.log(data);
      //   progressUpdate({ status: "done", data: data });
      var pos = data.text.search("LADWP"); //TITLE OF COMPANY
      if (pos === -1) {
        var bwp = data.text.search("Burbank");
        if (bwp === -1) {
          var pwp = data.text.search("PASADENA");
          if (pwp === -1) {
            var gwp = data.text.search("glendale");
            if (gwp === -1) {
              var ru = data.text.search("RIVERSIDE");
              if (ru === -1) {
                var ae = data.text.search("Anaheim");
                if (ae === -1) {
                  var sce = data.text.search("EDISON");
                  if (sce === -1) {
                    var los = data.text.search("Los");
                    if (los === -1) {
                      console.log("No companies Found from the seven choices");
                    } else {
                      var lossearch = "kWh";
                      var forLos = data.text.split(" ");
                      var lossearchIndex = forLos.findIndex(
                        (word) => word == lossearch
                      );
                      var losnextWord = forLos[lossearchIndex - 1];
                      if (isNaN(losnextWord)) {
                        let losfinalamount = losnextWord * 0.15358422939068;
                        var losfinalOutput = Math.round(
                          losfinalamount * 142.85714286
                        );
                        $(".fas").removeClass("fa-spinner fa-spin");
                        $(".fas").addClass("fa-check");
                        $(".finaltest").css({ visibility: "visible" });
                        $(".step2").css({ visibility: "hidden" });
                        $(".threeee").css({ visibility: "visible" });
                        $(".form-data").removeClass("form-hidden");
                        console.log(
                          "The estimated price for your solar system will be " +
                            "$" +
                            losfinalOutput
                        );
                      } else {
                        console.log(
                          "We were not able to extract the monthly bill from your LADWP Bill."
                        );
                      }
                    }
                  } else {
                    var scesearch = "charges";
                    var forEdison = data.text.split(" ");
                    var scesearchIndex = forEdison.findIndex(
                      (word) => word == scesearch
                    );

                    var scenextWord = forEdison[scesearchIndex + 1];
                    // console.log(scenextWord);
                    if (isNaN(scenextWord)) {
                      var scePrice = scenextWord.split(" ");
                      var scePriceIndex = scePrice.findIndex(
                        (scePri) => scePri === dollar
                      );
                      var scefoundFinal = scePrice[scePriceIndex + 1];
                      var scenumb = Number(
                        scefoundFinal.replace(/[^0-9\.]+/g, "")
                      );
                      var scefinalOutput = Math.round(scenumb * 142.85714286);
                      $(".fas").removeClass("fa-spinner fa-spin");
                      $(".fas").addClass("fa-check");
                      $(".finaltest").css({ visibility: "visible" });
                      $(".step2").css({ visibility: "hidden" });
                      $(".threeee").css({ visibility: "visible" });
                      $(".form-data").removeClass("form-hidden");
                      console.log(
                        "The estimated price for your solar system will be " +
                          "$" +
                          scefinalOutput
                      );
                    } else {
                      console.log(
                        "We were not able to extract the monthly bill from your Edison Bill."
                      );
                    }
                  }
                } else {
                  var aesearch = "Electric";
                  var forAnaheim = data.text.split(" ");
                  var aesearchIndex = forAnaheim.findIndex(
                    (word) => word == aesearch
                  );
                  var aenextWord = forAnaheim[aesearchIndex + 2];
                  if (isNaN(aenextWord)) {
                    var aePrice = aenextWord.split(" ");
                    var aePriceIndex = aePrice.findIndex(
                      (aePri) => aePri === dollar
                    );
                    var aefoundFinal = aePrice[aePriceIndex + 1];
                    var aenumb = Number(aefoundFinal.replace(/[^0-9\.]+/g, ""));
                    var aefinalOutput = Math.round(aenumb * 142.85714286);
                    $(".fas").removeClass("fa-spinner fa-spin");
                    $(".fas").addClass("fa-check");
                    $(".finaltest").css({ visibility: "visible" });
                    $(".step2").css({ visibility: "hidden" });
                    $(".threeee").css({ visibility: "visible" });
                    $(".form-data").removeClass("form-hidden");
                    console.log(
                      "The estimated price for your solar system will be " +
                        "$" +
                        aefinalOutput
                    );
                  } else {
                    app.locals.finalaeMessage =
                      "We were not able to extract the monthly bill from your Anaheim Bill.";
                    console.log(
                      "We were not able to extract the monthly bill from your Anaheim Bill."
                    );
                  }
                }
              } else {
                var rusearch = "ELECTRICITY]";
                var forRiverside = data.text.split(" ");
                var rusearchIndex = forRiverside.findIndex(
                  (word) => word == rusearch
                );
                var runextWord = forRiverside[rusearchIndex + 1];
                if (isNaN(runextWord)) {
                  var ruPrice = runextWord.split(" ");
                  var ruPriceIndex = ruPrice.findIndex(
                    (ruPri) => ruPri === dollar
                  );
                  var rufoundFinal = ruPrice[ruPriceIndex + 1];
                  var runumb = Number(rufoundFinal.replace(/[^0-9\.]+/g, ""));
                  var rufinalOutput = Math.round(runumb * 142.85714286);
                  $(".fas").removeClass("fa-spinner fa-spin");
                  $(".fas").addClass("fa-check");
                  $(".finaltest").css({ visibility: "visible" });
                  $(".step2").css({ visibility: "hidden" });
                  $(".threeee").css({ visibility: "visible" });
                  $(".form-data").removeClass("form-hidden");
                  console.log(
                    "The estimated price for your solar system will be " +
                      "$" +
                      rufinalOutput
                  );
                } else {
                  console.log(
                    "We were not able to extract the monthly bill from your Riverside Bill."
                  );
                }
              }
            } else {
              var gwpsearch = "TOTAL";
              var forGlendale = data.text.split(" ");
              var gwpsearchIndex = forGlendale.findIndex(
                (word) => word == gwpsearch
              );
              var gwpnextWord = forGlendale[gwpsearchIndex + 3];
              if (isNaN(gwpnextWord)) {
                var gwpPrice = gwpnextWord.split(" ");
                var gwpPriceIndex = gwpPrice.findIndex(
                  (gwpPri) => gwpPri === dollar
                );
                var gwpfoundFinal = gwpPrice[gwpPriceIndex + 1];
                var gwpnumb = Number(gwpfoundFinal.replace(/[^0-9\.]+/g, ""));
                var gwpfinalOutput = Math.round(gwpnumb * 142.85714286);
                $(".fas").removeClass("fa-spinner fa-spin");
                $(".fas").addClass("fa-check");
                $(".finaltest").css({ visibility: "visible" });
                $(".step2").css({ visibility: "hidden" });
                $(".threeee").css({ visibility: "visible" });
                $(".form-data").removeClass("form-hidden");
                console.log(
                  "The estimated price for your solar system will be " +
                    "$" +
                    gwpfinalOutput
                );
              } else {
                console.log(
                  "We were not able to extract the monthly bill from your Glendale Bill."
                );
              }
            }
          } else {
            var pwpsearch = "Total";
            var forPasadena = data.text.split(" ");
            var pwpsearchIndex = forPasadena.findIndex(
              (word) => word == pwpsearch
            );
            var pwpnextWord = forPasadena[pwpsearchIndex + 1];
            if (pwpnextWord === "Electric") {
              pwpnextWord = forPasadena[pwpsearchIndex + 3];
            } else {
              console.log(
                "Please upload the correct image of your PASADENA bill"
              );
            }
            var pwpPrice = pwpnextWord.split(" ");
            var pwpPriceIndex = pwpPrice.findIndex(
              (pwpPri) => pwpPri === dollar
            );
            var pwpfoundFinal = pwpPrice[pwpPriceIndex + 1];
            var pwpnumb = Number(pwpfoundFinal.replace(/[^0-9\.]+/g, ""));
            var pwpfinalOutput = Math.round(pwpnumb * 142.85714286);
            $(".fas").removeClass("fa-spinner fa-spin");
            $(".fas").addClass("fa-check");
            $(".finaltest").css({ visibility: "visible" });
            $(".step2").css({ visibility: "hidden" });
            $(".threeee").css({ visibility: "visible" });
            $(".form-data").removeClass("form-hidden");
            console.log(
              "The estimated price for your solar system will be " +
                "$" +
                pwpfinalOutput / 2
            );
          }
        } else {
          var search = "Electric";
          var forBurbank = data.text.split(" ");
          var searchIndex = forBurbank.findIndex((word) => word == search);
          var bbnextWord = forBurbank[searchIndex + 1];
          if (isNaN(bbnextWord)) {
            var bbprice = bbnextWord.split(" ");
            var bbpriceIndex = bbprice.findIndex((bbpri) => bbpri == dollar);
            var bbfoundFinal = bbprice[bbpriceIndex + 1];
            var bbnumb = Number(bbfoundFinal.replace(/[^0-9\.]+/g, ""));
            var bbfinalOutput = Math.round(bbnumb * 142.85714286);
            $(".fas").removeClass("fa-spinner fa-spin");
            $(".fas").addClass("fa-check");
            $(".finaltest").css({ visibility: "visible" });
            $(".step2").css({ visibility: "hidden" });
            $(".threeee").css({ visibility: "visible" });
            $(".form-data").removeClass("form-hidden");
            console.log(
              "The estimated price for your solar system will be " +
                "$" +
                bbfinalOutput
            );
          } else {
            console.log(
              "We were not able to extract the monthly bill from your Burbank Bill."
            );
          }
        }
      } else {
        var price = data.text.search("$");
        if (price === -1) {
          console.log("No price found");
        } else {
          var number = "kWh";
          var words = data.text.split(" ");
          var numberIndex = words.findIndex((word) => word == number);
          var nextWord = words[numberIndex + 1];
          if (isNaN(nextWord)) {
            //Finding Dollar last
            var priced = nextWord.split(" ");
            var priceIndex = priced.findIndex((pric) => pric == dollar);
            var foundFinal = priced[priceIndex + 1];
            var numb = Number(foundFinal.replace(/[^0-9\.]+/g, ""));
            var finalOutput = Math.round(numb * 142.85714286);
            $(".fas").removeClass("fa-spinner fa-spin");
            $(".fas").addClass("fa-check");
            $(".finaltest").css({ visibility: "visible" });
            $(".step2").css({ visibility: "hidden" });
            $(".threeee").css({ visibility: "visible" });
            $(".form-data").removeClass("form-hidden");
            console.log(
              "The estimated price for your solar system will be " +
                "$" +
                finalOutput +
                ". Battery backup systems not included in estimate, must call or email to get package price. If you want us to contact you then please fill the contact form below."
            );
            // console.log(search_word(data.text,"kWh"))
          } else {
            console.log(
              "We were not able to extract the monthly bill from your LADWP Bill."
            );
          }
        }
      }
    });
}
