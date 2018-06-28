let canvas = document.getElementById('confetti');
canvas.width = 600;
canvas.height = 600;

let ctx = canvas.getContext("2d");
let pieces = []; //will hold pieces of confetti
const numberOfPieces = 50;

// colors from our palette used in the puzzle game
let colorObj = {
  red: 'rgb(255,0,0)',
  yellow: 'rgb(255,242,0)',
  orange: 'rgb(255,106,0)',
  blue: 'rgb(22,94,247)',
  green: 'rgb(0, 128, 0)',
}
// picking a random color from the object
function randomColor() {
let colKey = Math.floor((Math.random() * Object.keys(colorObj).length));
return Object.entries(colorObj)[colKey][1]; // using ES6 Object.entries to get a random property from our colorObj. We need only value, the rgb color, thus [1].
};

function update () {
  for (let i = pieces.length -1; i >=0; i--) {
    let p = pieces[i]; // the for loop iterates through the pieces array, starting from the one before last; runs under the condition that i equals or larger than 0; i decreases by 1, each time it iterates.  

    if (p.y > canvas.height) {
      pieces.splice(i, 1); //if the piece reaches the lower border of the canvas, it's getting removed (*1* element) from the array on the place *i*. 
      continue; //after it removes the element, the iteration and continues from there on.
    }

    while (pieces.length < numberOfPieces) {
      pieces.push(new piece(Math.random() * canvas.width, -20)); // adding new pieces to the array: pieces; with x & y
    }
    
    p.y += p.gravity; //position of a piece on the y axe is being changed by as much as defined in gravity.
    p.rotation += p.rotationSpeed; 
  }
  setTimeout(update, 1); //the function will be called after 1 millisecond
}



function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height); //this will prevent that the pieces will stay on the canvas, snake-like. 

  pieces.forEach(function (p) { //iterates through all elements in the array pieces
    ctx.save(); //we need to save the canvases and restore it below, to make just the pieces rotate.
    ctx.fillStyle = p.color;
    ctx.translate(p.x +p.size/2, p.y +p.size/2); // it will translate the canvas to the center of the specific component;its position + half of its size. 
    ctx.rotate(p.rotation); //we set rotation in the piece function; 

    ctx.fillRect(-p.size / 2, -p.size/2, p.size, p.size); // this draws a new element: it is placed at 0, 0 of the translated canvas, thus *-p.size* https://www.screencast.com/t/DSKpt7NxH; https://www.w3schools.com/graphics/game_rotation.asp

    ctx.restore(); // this will stop from transforming other elements. 
  })
  requestAnimationFrame(draw); //to update the animation on screen
}

//this function will define how the confetti will be like
//it will store all important features
function piece (x, y) {
this.x = x; //this refers to global object this === window; the variable remains global
this.y = y;
this.size = (Math.random() * 0.5+0.75)* 15;
this.gravity = (Math.random() * 0.5+0.75)* 1  //the gravity can be in a similar range to size of the piece. 15 would be to fast. addtionally check *gravitySpeed*.
this.rotation = (Math.PI * 2) * Math.random(); //how much we rotate the element;
this.rotationSpeed = (Math.PI * 2) * Math.random() * 0.005; //how fast we rotate it;
this.color = randomColor();

}

while (pieces.length < numberOfPieces) {
  pieces.push(new piece(Math.random() * canvas.width, Math.random() * canvas.height)); // adding new pieces to the array: pieces; with x & y
}
// both functions will call themselves
update(); 
draw(); 