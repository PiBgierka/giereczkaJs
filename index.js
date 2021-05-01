// Import stylesheets
import "./style.css";
import "phaser";

// Write Javascript code!
const appDiv = document.getElementById("app");

var config = {
  type: Phaser.AUTO,
  width: 680,
  height: 400,
  parent: appDiv,
  backgroundColor: "48a",
  physics: {
    default: "arcade"
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
var ball, ship, enemy, bullet;
var bricks;
var cursors;
var gameoverText;

function preload() {
  this.load.baseURL = "https://examples.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.image("ball", "games/breakout/ball.png");
  this.load.image("ship", "games/defender/ship.png");
  this.load.image("bullet", "games/breakout/brick1.png");
  this.load.image("background", "games/invaders/starfield.png");

  this.load.spritesheet("enemy", "games/starstruck/droid.png", {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  let back = this.add.tileSprite(0, 28, 500, 300, "background");
  back.setOrigin(0);
  back.setScrollFactor(0);
  ball = this.physics.add.sprite(250, 350, "ball");
  ball.setOrigin(0.5, 0.5);

  ball.body.velocity.x = 100;
  ball.body.velocity.y = -150;
  ball.body.bounce.set(1);

  ball.body.setCollideWorldBounds(true);
  ball.body.onWorldBounds = true;

  ship = this.physics.add.sprite(150, 380, "ship");
  ship.setOrigin(0.5);
  ship.body.collideWorldBounds = true;
  ship.body.immovable = true;

  enemy = this.physics.add.sprite(500, 30, "enemy");
  enemy.setOrigin(0.5);
  enemy.body.collideWorldBounds = true;
  enemy.body.immovable = true;

  cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: "fly",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
}

function update() {
  enemy.anims.play("fly", true);
  ship.body.velocity.y = 0;
  if (cursors.up.isDown) {
    ship.body.velocity.y = -250;
  } else if (cursors.down.isDown) {
    ship.body.velocity.y = 250;
  }
  ship.body.velocity.x = 0;
  if (cursors.left.isDown) {
    ship.body.velocity.x = -250;
  } else if (cursors.right.isDown) {
    ship.body.velocity.x = 250;
  }
}
