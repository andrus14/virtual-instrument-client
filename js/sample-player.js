let online = true;

let instrument = 'piano';

// define sample files
const pianoFiles = ["pack-1/c.mp3", "pack-1/d.mp3", "pack-1/e.mp3"];
let piano = Array(pianoFiles.length);

const kannelFiles = ["kannel/00-A.wav", "kannel/01-D.wav", "kannel/02-E.wav", "kannel/03-F-Sharp.wav", "kannel/04-G.wav", "kannel/05-A.wav", "kannel/06-B.wav"];
let kannel = Array(kannelFiles.length);

const drumFiles = ["drums/drum-01.wav", "drums/drum-02.wav", "drums/drum-03.wav"];
let drums = Array(drumFiles.length);


let circles = Array(3);

let layer0;
let layer1;
let layer2;
let layer3;

// P5.js sound analyzer 
// visualization uses this
let fft;
// visualization parameters
let spectrum, energy, size;


// playing with keyboard
document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  
  if(online == true){
    switch (keyName) {
      // kannel asdfghj
      case 'a':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 0} );
        break;
      case 's':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 1} );
        break;
      case 'd':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 2} );
        break;
      case 'f':
          instrument = 'kannel';
          socket.emit("send-data", {'kannel': 3} );
          break;
      case 'g':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 4} );
        break;
      case 'h':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 5} );
        break;
      case 'j':
        instrument = 'kannel';
        socket.emit("send-data", {'kannel': 6} );
        break;
      // piano qwe
      case 'q':
        instrument = 'piano';
        socket.emit("send-data", {'piano': 0} );
        break;
      case 'w':
        instrument = 'piano';
        socket.emit("send-data", {'piano': 1} );
        break;
      case 'e':
        instrument = 'piano';
        socket.emit("send-data", {'piano': 2} );
        break;
      // drums zxc
      case 'z':
        instrument = 'drum';
        socket.emit("send-data", {'drum': 0} );
        break;
      case 'x':
        instrument = 'drum';
        socket.emit("send-data", {'drum': 1} );
        break;
      case 'c':
        instrument = 'drum';
        socket.emit("send-data", {'drum': 2} );
        break;
      // led on and off
      case '+':
        socket.emit("send-data", {"python": "on"} );
        break;
      case '-':
        socket.emit("send-data", {"python": "off"} );
        break;
    }
  } else { 
    // if connection to server is not established, we just play sounds locally
    switch (keyName) {
      case 'a':
          playSample(0);
          break;
      case 's':
          playSample(1);
          break;
      case 'd':
          playSample(2);
          break;
    }
  }
});

// playing with touch

const keys = document.querySelectorAll(".key");

keys.forEach((key, idx) => {  
  key.addEventListener('click', () => {   
    socket.emit("send-data", {"sample": idx} );
  });
});



function recieveData(data){
  console.log(data);
  if(data.hasOwnProperty("piano") ){
    playSample(data.piano);
  } else if(data.hasOwnProperty("kannel")){
    playKannel(data.kannel);
  } else if(data.hasOwnProperty("drum")){
    playDrum(data.drum);
  }
  
}


// play sample file
function playSample(s){
  piano[s].play();
}
function playKannel(s){
  kannel[s].play();
}
function playDrum(s){
  drums[s].play();
}


// preload music sample files and add them to sounds array
function preloadSampleFiles() {
  soundFormats('mp3', 'ogg');
  for (let i = 0; i < pianoFiles.length; ++i){
    piano[i] = loadSound("./samples/" + pianoFiles[i]);
  }
  for (let i = 0; i < kannelFiles.length; ++i){
    kannel[i] = loadSound("./samples/" + kannelFiles[i]);
  }
  for (let i = 0; i < drumFiles.length; ++i){
    drums[i] = loadSound("./samples/" + drumFiles[i]);
  }
}




function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // https://p5js.org/reference/#/p5.FFT
  fft = new p5.FFT(0.5, 64);

  preloadSampleFiles();
  

}



// visualization
function draw() {
  
  spectrum = fft.analyze(); 
  energy = fft.getEnergy(100, 255);
  size = map(energy, 0, 255, 0, windowHeight);

  let hue = map(energy, 0, 255, 0, 360);
  
  let centroidplot = 0.0;
  let spectralCentroid = 0;

  blendMode(BLEND);
  background(0, 0, 0, 20);
  
  
  blendMode(LIGHTEST);
  setGradient(
    0, 0, windowWidth, size*0.1, 
    color(`hsl(${round(hue)}, 90%, 15%)`),  color(0),
    2
    );
  
  
  setGradient(
    0, windowHeight-size*0.1, windowWidth, size*0.1, 
     color(0), color(`hsl(${round(hue)}, 90%, 15%)`),
    2
  );


  let nyquist = 22050;

// get the centroid
spectralCentroid = fft.getCentroid();

// the mean_freq_index calculation is for the display.
let mean_freq_index = spectralCentroid/(nyquist/spectrum.length);

centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, windowWidth*0.8);

    stroke(255, 255, 255, 20);
    rect(centroidplot, windowHeight*0.5+size*0.3, 0, -size*0.6);

    noFill();
    for (let i = 0; i< spectrum.length; i++){
      let x = windowWidth*0.1 + map(i, 0, spectrum.length, 0, windowWidth*0.8);
      let h = map(spectrum[i], 0, 255, 0, 200);
      stroke(`hsla(${round(map(i,0,spectrum.length,0,360))}, 50%, 50%, 0.1)`);
      strokeWeight(1);
      // if(instrument == 'kannel'){
        circle(x, windowHeight*0.5, h)
      // } else {
        // square(x, windowHeight*0.5, h )

      // }
      noStroke();
    }


    
}



function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === 2) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 1) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}


// helper functions
// allows browser to play sounds
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}
// handles browser resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}