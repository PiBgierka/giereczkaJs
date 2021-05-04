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
var enemiesHp = [0, 0, 0, 0, 0];
var PlayerHP = 3;
var shootCooldown = 0;
var enemyBullet;
var enemyBullets;
var gameoverText;
var score = 0;
var star;
var starGroup;
var scoreCount = 0;
var HPP = document.getElementById("HPP");
var scoreID = document.getElementById("scoreP");

function preload() {
  this.load.baseURL = "https://examples.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.image("ship", "games/defender/ship.png");
  this.load.image("bullet", "games/orbit/ball.png");
  this.load.image("enemybullet", "games/invaders/enemy-bullet.png");
  this.load.image("background", "games/invaders/starfield.png");
  this.load.image("star", "games/starstruck/star.png");

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
  this.enemyBullets = this.physics.add.group();
  this.starGroup = this.physics.add.group();

  HPP.innerHTML = "HP: " + PlayerHP;
  scoreID.innerHTML = "Score: " + score;

  this.anims.create({
    key: "fly",
    frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  startNextLevel(this.physics, this.enemies);

  this.physics.add.collider(this.bullets, this.enemies, function(bull, enem) {
    enem.body.velocity.x = 0;
    bull.disableBody(true, true);
    var index = enem.y / 30 - 1;
    enemiesHp[index]--;
    if (enemiesHp[index] == 0) {
      enem.disableBody(true, true);
      enemiesCount--;
    }
  });

  this.physics.add.collider(this.enemyBullets, ship, function(ship, bull) {
    bull.disableBody(true, true);
    PlayerHP--;
    HPP.innerHTML = "HP: " + PlayerHP;
    if (PlayerHP == 0) {
      ship.disableBody(true, true);
      gameoverText.visible = true;
    }
  });

  gameoverText = this.add.text(
    this.physics.world.bounds.centerX,
    200,
    "GAME OVER",
    { font: "40px Arial", fill: "#ffffff", align: "center" }
  );
  gameoverText.setOrigin(0.5);
  gameoverText.visible = false;
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  counter++;
  shootCooldown++;
  scoreCount++;
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
  if (shootCooldown > 200) {
    try {
      shootCooldown = 0;
      var index = Math.floor((Math.random() * 100) % enemiesCount);
      enemyBullet = this.physics.add.sprite(
        this.enemies.getChildren()[index].x,
        this.enemies.getChildren()[index].y,
        "enemybullet"
      );
      this.enemyBullets.add(enemyBullet);
      for (var i = 0; i < this.enemyBullets.getChildren().length; i++) {
        var bull = this.enemyBullets.getChildren()[i];
        bull.setOrigin(0.5, 0.5);
        bull.body.setCollideWorldBounds(false);

        bull.body.onWorldBounds = true;
       bull.body.velocity.x = -250;
        if (bull.body.velocity.y == 0)
          bull.body.velocity.y = ((ship.y - bull.y) / (ship.x - bull.x)) * -250;
      }
    } catch {}
  }
  if (scoreCount > 600) {
    scoreCount = 0;
    star = this.physics.add.sprite(680, (Math.random() * 1000) % 400, "star");
    this.starGroup.add(star);
    for (var i = 0; i < this.starGroup.getChildren().length; i++) {
      var star = this.starGroup.getChildren()[i];
      star.setOrigin(0.5, 0.5);
      star.body.setCollideWorldBounds(false);
      star.body.onWorldBounds = true;
      star.body.velocity.x = -250;
    }

    this.physics.add.collider(star, ship, function(star, ship) {
      star.disableBody(true, true);
      score++;
      scoreID.innerHTML = "Score: " + score;
    });
  }
  if (enemiesCount == 0) {
    this.enemies.clear(true);
    startNextLevel(this.physics, this.enemies);
  }
}
function startNextLevel(physics, enemies) {
  level++;
  enemiesCount = level % 5;

  for (var i = 0; i < enemiesCount; i++) {
    enemiesHp[i] = Math.floor(level / 5);
    enemiesHp[i]++;
  }
  for (var i = 1; i <= level; i++) {
    enemy = physics.add.sprite(500, 30 * i, "enemy");
    enemy.setOrigin(0.5);
    enemy.body.immovable = true;
    enemies.add(enemy);
  }
  for (var i = 0; i < enemies.getChildren().length; i++) {
    var enem = enemies.getChildren()[i];
    enem.anims.play("fly", true);
  }
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
