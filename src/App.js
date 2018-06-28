import React, { Component } from 'react';
import $ from 'jquery';
import "./App.css";
import "./confetti.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      fieldWidth: 0,
      fieldHeight: 0,
      fieldInitialized: false,
      image: null,
      context2d: null,
      pieces: [],
  	  piecesCountVertical: "piecesCountVertical" in props ? props.piecesCountVertical : 2,
  	  piecesCountHorizontal: "piecesCountHorizontal" in props ? props.piecesCountHorizontal : 2,
  	  piecePlacementTolerance: "piecePlacementTolerance" in props ? props.piecePlacementTolerance : 10,
  	  currentPieceIndex: -1,
  	  currentZIndex: 0,
      mousePos: {
        x: 0,
        y: 0
      },
      mousePressed: false,
      solved: false
    }
  }
  
  allPuzzlePiecesCorrect(){
    for(var index = 0; index < this.state.pieces.length; index++){
      if(
        this.state.pieces[index].currentPos.x < this.state.pieces[index].fitsAtPos.x - this.state.piecePlacementTolerance ||
        this.state.pieces[index].currentPos.x > this.state.pieces[index].fitsAtPos.x + this.state.piecePlacementTolerance ||
        this.state.pieces[index].currentPos.y < this.state.pieces[index].fitsAtPos.y - this.state.piecePlacementTolerance ||
        this.state.pieces[index].currentPos.y > this.state.pieces[index].fitsAtPos.y + this.state.piecePlacementTolerance
      ){
        return false;
      }
    }
    return true;
  }
  
  initPuzzleField() {
    
    this.generatePieces();
  	this.setState({
  		context2d: document.getElementById("puzzleCanvas").getContext("2d"),
  		fieldInitialized: true
  	});
  	
  }
  
  generatePieces(){
	  var zIndex = this.state.piecesCountVertical * this.state.piecesCountHorizontal;
	  var pieceSize = this.getPieceSize();
	  var randomPositionRange = {
		  horizontal: this.state.fieldWidth - pieceSize.width,
		  vertical: this.state.fieldHeight - pieceSize.height
	  };
	  var pieces = [];
	  
	  for(var columns = 0; columns < this.state.piecesCountHorizontal; columns++){
		  for(var rows = 0; rows < this.state.piecesCountVertical; rows++){
			  pieces.push({
  				zIndex: zIndex--,
  				fitsAtPos: {
  					x: columns * pieceSize.width,
  					y: rows * pieceSize.height
  				},
  				currentPos: {
  					x: Math.floor(Math.random() * randomPositionRange.horizontal),
  					y: Math.floor(Math.random() * randomPositionRange.vertical),
  				},
  				size: {
  					width: pieceSize.width,
  					height: pieceSize.height
  				},
  				grabbedPos: {
  					x: 0,
  					y: 0
  				}
			  });
		  }
	  }
	  
	  pieces.sort(function(a, b){
			return a.zIndex - b.zIndex;
		});
	  
	  this.setState({
	    currentZIndex: this.state.piecesCountVertical * this.state.piecesCountHorizontal,
		  pieces: pieces
	  });
  }
  
  getPieceIndexAtMousePos(){
	  var pieceCount = this.state.pieces.length;
	  for(let index = pieceCount - 1; index >= 0; index--){
  		if(
  			this.state.pieces[index].currentPos.x <= this.state.mousePos.x &&
  			this.state.pieces[index].currentPos.x + this.state.pieces[index].size.width >= this.state.mousePos.x &&
  			this.state.pieces[index].currentPos.y <= this.state.mousePos.y &&
  			this.state.pieces[index].currentPos.y + this.state.pieces[index].size.height >= this.state.mousePos.y
  		){
  		  console.log(this.state.pieces, index, pieceCount);
  			return index;
  		}
	  }
	  return -1;
  }
  
  getPieceSize(){
    return {
		  width: this.state.image.width / this.state.piecesCountHorizontal,
		  height: this.state.image.height / this.state.piecesCountVertical
	  };
  }
  
  drawPuzzleFieldBackground(){
    var pieceSize = this.getPieceSize();
    
    // this.setState({context2d: {fillStyle: '#222'}})
	  this.state.context2d.fillStyle = "#222";
  	  this.state.context2d.fillRect(
  		0,
  		0,
  		this.state.fieldWidth,
  		this.state.fieldHeight,
	  );
	  
    this.state.context2d.strokeStyle = "#333";	  
    this.state.context2d.beginPath();
	  for(var rowNumber = 0; rowNumber < this.state.piecesCountVertical; rowNumber++){
      this.state.context2d.moveTo(0, rowNumber * pieceSize.height);
      this.state.context2d.lineTo(this.state.fieldWidth, rowNumber * pieceSize.height);
      this.state.context2d.stroke();
	  }
	  for(var columnNumber = 0; columnNumber < this.state.piecesCountHorizontal; columnNumber++){
      this.state.context2d.moveTo(columnNumber * pieceSize.width, 0);
      this.state.context2d.lineTo(columnNumber * pieceSize.width, this.state.fieldHeight);
      this.state.context2d.stroke();
	  }
  }
  
  drawPuzzlePieces(){
	  for(var pieceIndex = 0; pieceIndex < this.state.pieces.length; pieceIndex++){
		  this.drawPuzzlePiece(this.state.pieces[pieceIndex]);
	  }
  }
  
  drawPuzzlePiece(piece){
	  this.state.context2d.drawImage(
  		this.state.image,
  		
  		piece.fitsAtPos.x,
  		piece.fitsAtPos.y,
  		piece.size.width,
  		piece.size.height,
  		
  		piece.currentPos.x,
  		piece.currentPos.y,
  		piece.size.width,
  		piece.size.height
	  );
	  
	  this.state.context2d.strokeStyle = "#fff";
	  this.state.context2d.lineWidth = 0.5;
	  this.state.context2d.strokeRect(
  		piece.currentPos.x,
  		piece.currentPos.y,
  		piece.size.width,
  		piece.size.height
	  );
  }
  
  drawPuzzleField(){
    
	  this.drawPuzzleFieldBackground();
	  this.drawPuzzlePieces();
  }
  
  saveImage(base64, callback){
    var image = new Image();
    
  	image.onload = (function() {
      
  		this.puzzle.setState({
  			fieldWidth: this.image.naturalWidth,
  			fieldHeight: this.image.naturalHeight,
  		})
  		
  		this.puzzle.setState({
  		  image: this.image
  		});
  		
  		if(typeof this.callback == "function"){
  			(this.callback.bind(this.puzzle))();
  		}
  	}).bind({
  		puzzle: this,
  		image: image,
  		callback: callback
  	});
  	
  	image.src = base64;
  }
  
  fileChange(file){
    
    if(file.type.match(/\/(png|jpg|jpeg|gif)$/)){
      
      let fileReader = new FileReader();
      fileReader.onload = (function(){
        
        this.puzzle.saveImage(
          this.fileReader.result,
    		  function() {
      			this.render();
    		  }
        );
        
      }).bind({
        fileReader: fileReader, 
        puzzle: this
      });
      
      fileReader.readAsDataURL(file);
      
    } else {
      
      // alert("Dieser Bildtyp wird nicht unterstützt"); 
      $('#cover').fadeIn('slow');
      $('#alertMsg').fadeIn('slow');

      $('#alright1').on('click', function () {
      $('#cover').fadeOut('slow');
      $('#alertMsg').fadeOut('slow');
      });
    }
  }
  
  canvasMouseDown(e){
	  
    this.setState({
      mousePressed: true,
      mousePos: {
  			x: e.clientX + window.pageXOffset - e.target.offsetLeft,
  			y: e.clientY + window.pageYOffset - e.target.offsetTop,
  		}
    });
	
  	var pieceIndexAtMousePos = this.getPieceIndexAtMousePos();
  	
  	if(pieceIndexAtMousePos > -1){
  		
  		let sortedPieces = this.state.pieces;
  		
  		this.setState({
  		  currentPieceIndex: this.state.pieces.length - 1,
  		  currentZIndex: this.state.currentZIndex + 1
  		});
  		
  		sortedPieces[pieceIndexAtMousePos].grabbedPos.x = this.state.mousePos.x - sortedPieces[pieceIndexAtMousePos].currentPos.x;
  		sortedPieces[pieceIndexAtMousePos].grabbedPos.y = this.state.mousePos.y - sortedPieces[pieceIndexAtMousePos].currentPos.y;
  		sortedPieces[pieceIndexAtMousePos].zIndex = this.state.currentZIndex;
  		
  		sortedPieces.sort(function(a, b){
  			return a.zIndex - b.zIndex;
  		});
  		
  		this.setState({
  			pieces: sortedPieces
  		});
  	}
  }
  
  canvasMouseMove(e){
    
  	this.setState({
  		mousePos: {
  			x: e.clientX + window.pageXOffset - e.target.offsetLeft,
  			y: e.clientY + window.pageYOffset - e.target.offsetTop,
  		}
  	});
	  
    if(this.state.mousePressed){
		
  		if(this.state.currentPieceIndex > -1){
  			this.state.pieces[this.state.currentPieceIndex].currentPos.x = this.state.mousePos.x - this.state.pieces[this.state.currentPieceIndex].grabbedPos.x;
  			this.state.pieces[this.state.currentPieceIndex].currentPos.y = this.state.mousePos.y - this.state.pieces[this.state.currentPieceIndex].grabbedPos.y;
  		}
    }
  }
  
  canvasMouseUp(){
	  
    this.setState({
      mousePressed: false,
	    currentPieceIndex: -1
    });
  }
  
  checkPuzzlePiecePlacementButtonClick(){
    if(this.allPuzzlePiecesCorrect()){
      this.setState({
        solved: true
      });
      window.scrollTo(0, 0);
      this.drawPuzzleField();
    } else {
      // alert("Leider sitzen noch nicht alle Teile am richtigen Platz ...");
      $('#cover').fadeIn('slow');
      $('#alertMsg2').fadeIn('slow');

      $('#alright2').on('click', function () {
      $('#cover').fadeOut('slow');
      $('#alertMsg2').fadeOut('slow');
      });

    }
  }
  
  newButtonClick(){
    this.setState({
      fieldInitialized: false,
      image: null,
      solved: false
    });
  }
  
  componentDidUpdate(){
    if(
      this.state.image !== null &&
      this.state.solved === false
    ){
      if(this.state.fieldInitialized === false){
        this.initPuzzleField();
      } else {
        this.drawPuzzleField();
      }
    }
  }
  
  render(){
    if(this.state.solved === false){
      if(this.state.image === null){
        return <div id="puzzleField">
          <h1 id="uploadPic">Lade ein lokales Bild hoch ...</h1>
          <div className="controls">
            <label className="button" id="imageSelectorLabel">
              Bild wählen ...
              <input type="file" id="imageSelector" onChange={(event) => this.fileChange(event.target.files[0])} />
            </label>
          </div>
        </div>
      } else {
        return <div className="container" id="puzzleField">
          <h1 id="tryToPuzzle">... und versuch es zusammenzupuzzlen ;)</h1>
          <canvas id="puzzleCanvas"
            width={this.state.fieldWidth}
            height={this.state.fieldHeight}
            onMouseDown={(e) => this.canvasMouseDown(e)}
            onMouseMove={(e) => this.canvasMouseMove(e)}
            onMouseUp={() => this.canvasMouseUp()}
          ></canvas>
          <div className="controls">
            <button className="button" id="checkPuzzle" onClick={() => this.checkPuzzlePiecePlacementButtonClick()}>Prüfen</ button>
            <button className="button" id="newPuzzle" onClick={() => this.newButtonClick()}>Neues Puzzle</ button>
          </div>
        </div>
      }
    } else {
      $('#cover').fadeIn('slow');
      $('#confetti').fadeIn('slow');  
      $('#confetti').css('display', 'block');       
      $('#alertMsg3').fadeIn('slow');      

      $('#alright3').on('click', function () {
      $('#cover').fadeOut('slow');
      $('#confetti').fadeOut('slow');
      $('#alertMsg3').fadeOut('slow');
      });

      return <div id="puzzleField">
        <h1 id="wellDone">Geschafft!</h1>
        <img id="resultImage" src={this.state.image.src} />
        <div className="controls">
          <button className="button" id="newPuzzle2" onClick={() => this.newButtonClick()}>Neues Puzzle</ button>
        </div>    
      </div>


        
    }
  }
}

// ReactDOM.render(
//   <Puzzle piecesCountVertical="3" piecesCountHorizontal="3" />,
//   document.getElementById('appMount')
// );

export default App;