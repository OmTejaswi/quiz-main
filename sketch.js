var submitButton;
var inp_1, inp_2;
var title;
var question;
var op_1, op_2, op_3, op_4;
var pc=0;
var limit = 0;
var gs="start";
var db;
var resetButton;
var A, playerData;
var r1, r2, r3, r4;
var nameAr = [];
var ansAr = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  db = firebase.database();

  db.ref("gameState").on("value", function(data){
    gs = data.val();
  })

  db.ref("playerCount").on("value", function(data){
    pc = data.val();
  })


  //submit button
  submitButton = createButton();
  submitButton.html("Submit");
  submitButton.position(window.innerWidth/2.05, window.innerHeight/1.5);
  submitButton.style("width", "70px");
  submitButton.style("height", "30px");
  submitButton.style("backgroundColor", "red");
  submitButton.style("color", "gold");
  submitButton.style("fontSize", "15px");
  submitButton.mousePressed(change);

  //input buttons
  inp_1 = createInput();
  inp_1.position(window.innerWidth/2.55, window.innerHeight/1.7);
  inp_1.attribute("placeholder", "Enter Your Name Here");
  inp_2 = createInput();
  inp_2.position(window.innerWidth/1.95, window.innerHeight/1.7);
  inp_2.attribute("placeholder", "Enter Correct Option No.");

  //title
  title = createElement("h1");
  title.html("MyQuiz Game");
  title.position(window.innerWidth/2.25, window.innerHeight/30);
  
  //question
  question = createElement("h2");
  question.html("Question:- What starts and ends with the letter 'E', but has only one letter? ");
  question.position(window.innerWidth/3.6, window.innerHeight/5);

  //option 1
  op_1 = createElement("h3");
  op_1.html("1: Everyone");
  op_1.position(window.innerWidth/3.6, window.innerHeight/3.8);

  //option 2
  op_2 = createElement("h3");
  op_2.html("2: Envelope");
  op_2.position(window.innerWidth/3.6, window.innerHeight/3.2);

  //option 3
  op_3 = createElement("h3");
  op_3.html("3: Estimate");
  op_3.position(window.innerWidth/3.6, window.innerHeight/2.75);

  //option 4
  op_4 = createElement("h3");
  op_4.html("4: Example");
  op_4.position(window.innerWidth/3.6, window.innerHeight/2.4);

  //reset button
  resetButton = createButton("Reset");
  resetButton.position(window.innerWidth/25, window.innerHeight/15);
  resetButton.mousePressed(reset);

   

}

function draw() {
  background(0, 228, 208);

  if(pc === 4){
    result();
    gs = "result";
    db.ref("/").update({gameState: gs});
  }

  if(gs === "result" && nameAr.length === pc && ansAr.length === pc && nameAr.includes(undefined) === false) {
    background("yellow")

    r1 = createElement("h3").html(nameAr[0] + ": " + ansAr[0]).position(window.innerWidth/2, window.innerHeight/1.5).style("color", "red");
    r2 = createElement("h3").html(nameAr[1] + ": " + ansAr[1]).position(window.innerWidth/2, window.innerHeight/1.4).style("color", "red");
    r3 = createElement("h3").html(nameAr[2] + ": " + ansAr[2]).position(window.innerWidth/2, window.innerHeight/1.3).style("color", "red");
    r4 = createElement("h3").html(nameAr[3] + ": " + ansAr[3]).position(window.innerWidth/2, window.innerHeight/1.2).style("color", "red");
    //check();

  }

}

function change() {
  pc++
  db.ref("/").update({playerCount: pc});
  db.ref("players/player"+pc).set({playerName: inp_1.value(), answer: inp_2.value()});

  inp_1.hide();
  inp_2.hide();
  submitButton.hide();

}

function reset() {
  db.ref("/").update({playerCount: 0, gameState: "start"});
  db.ref("players").remove();

  inp_1.show();
  inp_2.show();
  submitButton.show();

}

function result() {
  if(pc === 4 && limit === 0) {
    //answers
    for(var i = 1; i < pc+1; i++) {
      db.ref("players/player"+i+"/answer").on("value", function(data){
        ansAr.push(data.val());
      })
    }


    //names
    for(var i = 1; i < pc + 1; i++) {
      db.ref("players/player"+i+"/playerName").on("value", function(data){
        nameAr.push(data.val());
      })
      limit = 1;
    }
  }
}