"use strict";

const GAME_WIDTH = 800, GAME_HEIGHT = 600;
let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, '',{preload: preload, create: create, update: update});
let catcher, cursors, cats, bomb;
let SPEED = 5;
let score = 0, txtScore;

function preload(){//load assets
	game.load.image('bg', 'img/bg.png');
	game.load.image('catcher', 'img/catcher.png');
	game.load.image('cat', 'img/cat.png');
	game.load.image('bomb', 'img/bomb.png');
	}
	
function create(){//setup game
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0,0,'bg');
	catcher = game.add.sprite(400,300,'catcher');
	catcher.anchor.setTo(.5,0);
	cats = game.add.group();
	for(var i = 0; i < 2; i++){
		cats.create(Math.random()*(game.width - 100), Math.random()*(game.height - 100), 'cat');
	}
	var cat = cats.getFirstAlive();
	cat.kill();
	bomb = game.add.sprite(-200,300, 'bomb');
	cursors = game.input.keyboard.createCursorKeys();
	game.physics.enable(catcher, Phaser.Physics.ARCADE);
	game.physics.enable(cats, Phaser.Physics.ARCADE);
	game.physics.enable(bomb, Phaser.Physics.ARCADE);
	score = 0;
	let style = {font: "20px times", fill: "#FF0000"};
	txtScore = game.add.text(10, 10, "Score: " + score.toString(), style);
	}
	
function update(){//game loop
	if(cursors.left.isDown){
		if (catcher.x > 15){
			catcher.x -= SPEED;
			catcher.scale.x = 1;
		}
	}
	if(cursors.right.isDown){
		if (catcher.x < (GAME_WIDTH - 15)){
			catcher.x += SPEED;
			catcher.scale.x = -1;
			}
	}
	if(cursors.up.isDown){
		if (catcher.y > 0){
			catcher.y -= SPEED;
			}
	}
	if(cursors.down.isDown){
		if (catcher.y < (GAME_HEIGHT - 40)){
			catcher.y += SPEED;
			}
	}
	
	
	if(score > 9){
		game.physics.arcade.moveToObject(bomb, catcher, 1, 2000);
	}
	game.physics.arcade.overlap(catcher,cats,catHitHandler);
	game.physics.arcade.overlap(catcher,bomb,bombHitHandler);
	createCat();
	
	}

function catHitHandler(catcherObject, catObject){
	catObject.x = Math.random()*game.width;
	catObject.y = Math.random()*game.height;	
	if(catObject.x > 770 || catObject.x < 30 || catObject.y > 570 || catObject.y < 30){
		catHitHandler(catcherObject, catObject)
		score--;
		}
	score++;
	txtScore.setText("Score: " + score.toString());
}

function createCat() {
	var cat = cats.getFirstExists(false);
	if(score > 4 && cat){
		cat.revive();
	}
}


function bombHitHandler(catcherObject, bombObject){
	catcher.kill();
	txtScore.setText("You lose!");
	cats.removeAll();
	bomb.kill();
}


