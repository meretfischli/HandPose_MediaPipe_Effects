const videoElement = document.getElementById("input_video");

const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

function onResults(results) {
  //return, falls es keine resultate gibt
  if (!results.multiHandLandmarks) {
    return;
  }

  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.globalCompositeOperation = "source-over";

  canvasCtx.restore();

 if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks){
      emitters.push(
        new Emitter(
          landmarks[8].x * width,
          landmarks[8].y * height, 
          landmarks[8].z
        )
      );
      emitters.push(
        new Emitter(
          landmarks[12].x * width,
          landmarks[12].y * height,
          landmarks[12].z
        )
      ); 
    }
  }
  
}

let emitters = []



function setup() {
  cvs = createCanvas(1280, 720);
  cvs.parent("ctr");
  cvs.style("position", "absolute", "left", 0, "top", 0, "z-index", 0);

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  camera.start();

  webcam = select("#input_video");
  frameRate(30);
}

function draw() {
  translate(video.width, 0)
	scale(-1,1)
  image(webcam, 0, 0, webcam.width, webcam.height);

  if (emitters.length > 3) {
    emitters.shift();
  }
  for (let emitter of emitters) {
    emitter.emit(1);
    emitter.show();
    emitter.update();
  }
}

