let model

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




function setup() {
  cvs = createCanvas(1280, 720);
  cvs.parent("ctr");
  cvs.style("position", "absolute", "left", 0, "top", 0, "z-index", 0);


  // const options = {
  //   inputs: [x, y],
	// 	outputs: ['label'],
  //   task: 'classification',
  //   debug: true
  // }

  // model = ml5.neuralNetwork(options)


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
  // translate(cvs.width, 0)
	// scale(-1,1)
  image(webcam, 0, 0, webcam.width, webcam.height);
}


function onResults(results) {
  //return, falls es keine resultate gibt
  if (!results.multiHandLandmarks) {
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {

      drawLandmarks(canvasCtx, landmarks, { color: "#FFF000", lineWidth: 2 });
      fill(0, 0, 255);
      circle(landmarks[8].x * width, landmarks[8].y * height, 100, 100);
    }
  }
  canvasCtx.restore();

  // if (results.multiHandLandmarks) {
  // 	for (const landmarks of results.multiHandLandmarks) {
  // 		for (let i = 0; i < landmarks.length; i++){
  // 			fill(0, 0, 255)
  // 			noStroke()
  // 			circle(landmarks[i].x * width, landmarks[i].y * height, 10, 10)

  // 			//drawConnections()

  // 		}
  // 	}
  // }
}
