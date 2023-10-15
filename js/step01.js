$( document ).ready(function() {
  // UUID 생성
  let uuid = self.crypto.randomUUID();
  console.log(uuid);
  
	// QR코드 스캐너 활성화
	qrScannerOn();
	
});

function qrScannerOn() {
  var video = document.createElement("video");
  var canvasElement = document.getElementById("scanbox");
  var canvas = canvasElement.getContext("2d");
  var canBox = document.getElementById("can_box");

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  // Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  });

  function tick() {
    // scanwrap.style.background = 'none';
    canBox.hidden = true;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canBox.hidden = true;
      canvasElement.hidden = false;

      canvasElement.height = video.videoHeight * 0.9;
      canvasElement.width = video.videoWidth * 0.9;
      console.log(canvasElement.height, canvasElement.width)
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

        readQrCodeData(code.data);
      // 읽으면 종료
        return;
      } else {
        outputMessage.hidden = false;
        outputData.parentElement.hidden = true;
      }
    }
    requestAnimationFrame(tick);
  }
}

function readQrCodeData(data) {
  var kickCompany = data.split('?')[0];
  var kickId = data.split('?')[1].split('name=')[1];

  $('#kickId').val(kickId);
}
