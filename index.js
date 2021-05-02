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
    update: update,
    function: startNextLevel
  }
};

var game = new Phaser.Game(config);
var ball, ship, enemy, bullet;
var enemies, bullets;
var cursors;
var counter = 0;
var timesHited;
var level = 0;
var stage = 0;
var enemiesCount = 0;
function preload() {
  this.load.baseURL = "https://examples.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.image("ship", "games/defender/ship.png");
  this.load.image("bullet", "games/orbit/ball.png");
  this.load.image("background", "games/invaders/starfield.png");

  this.load.spritesheet("enemy", "games/starstruck/droid.png", {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  let back = this.add.tileSprite(0, 0, 680, 400, "background");
  back.setOrigin(0);
  back.setScrollFactor(0);

  ship = this.physics.add.sprite(150, 380, "ship");
  ship.setOrigin(0.5);
  ship.body.collideWorldBounds = true;
  ship.body.immovable = true;

  this.enemies = this.physics.add.group();
  this.bullets = this.physics.add.group();

  startNextLevel(this.physics, this.enemies);

  this.physics.add.collider(this.bullets, this.enemies, function(bull, enem) {
    bull.disableBody(true, true);
    hitEnemy(enem);
  });

  cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: "fly",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
}

function update() {
  counter++;
  movement();

  //shooting
  if (cursors.space.isDown && counter > 20) {
    counter = 0;
    bullet = this.physics.add.sprite(ship.x, ship.y, "bullet");
    bullet.setOrigin(0.5, 0.5);
    bullet.body.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.body.velocity.x = 250;
    this.bullets.add(bullet);
    for (var i = 0; i < this.bullets.getChildren().length; i++) {
      var bull = this.bullets.getChildren()[i];
      bull.setOrigin(0.5, 0.5);
      bull.body.setCollideWorldBounds(true);
      bull.body.onWorldBounds = true;
      bull.body.velocity.x = 250;
    }
  }
  if (enemiesCount == 0) {
    startNextLevel(this.physics, this.enemies);
  }
}
function hitEnemy(enem) {
  enem.disableBody(true, true);
  enemiesCount--;
}
function startNextLevel(physics, enemies) {
  level++;
  enemiesCount = level;
  for (var i = 1; i <= level; i++) {
    enemy = physics.add.sprite(500, 30 * i, "enemy");
    enemy.setOrigin(0.5);
    enemy.body.collideWorldBounds = true;
    enemy.body.immovable = true;
    enemies.add(enemy);
  }
  // for (var i = 0; i < this.enemies.getChildren().length; i++) {
  //   var enem = this.enemies.getChildren()[i];
  //   enem.anims.play("fly", true);
  // }
}
function movement() {
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
