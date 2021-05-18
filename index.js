// Import stylesheets
import './style.css';
import 'phaser';

// Write Javascript code!
const appDiv = document.getElementById('app');

var config = {
  type: Phaser.AUTO,
  width: 680,
  height: 400,
  parent: appDiv,
  backgroundColor: '48a',
  physics: {
    default: 'arcade'
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    function: startNextLevel
  }
};
var HPText;
var BossHPText;
var ScoreText;
var LvLText;
var game = new Phaser.Game(config);
var ball, ship, enemy, bullet;
var enemies, bullets, rocks;
var cursors;
var counter = 0;
var timesHited;
var bossHPmess = '';
var level = 0;
var stage = 0;
var enemiesCount = 0;
var enemiesHp = [0, 0, 0, 0, 0];
var PlayerHP = 3;
var shootCooldown = 0;
var enemyBullet;
var flyingRock;
var enemyBullets;
var gameoverText;
var score = 0;
var star;
var starGroup;
var boss = {};
boss.dmg = false;
var miniBoss;
var bossHp;
var damageBoss = false;
var scoreCount = 0;
var HPP = document.getElementById('HPP');
var BHP = document.getElementById('BHP');
var scoreID = document.getElementById('scoreP');
var rockTime = 0;
function topScore() {
  console.log(getCookie());
  if (getCookie() == null) return;
  if (getCookie().length == 0) return;
  var x = JSON.parse(getCookie());
  x.sort(function(a, b) {
    return b - a;
  });
  var s = '';
  for (var i = 0; i < x.length; i++) {
    if (i >= 5) break;
    s += '<span class="top-e">' + (i + 1) + '. ' + x[i] + '</span><br/>';
  }
  document.getElementById('top').innerHTML = s;
}
topScore();
function addScore() {
  console.log(getCookie());
  var a = [];
  if (getCookie() == null) {
    a.push(score);

    setCookie(JSON.stringify(a));
    return;
  }
  if (getCookie().length == 0) {
    a.push(score);
    setCookie(JSON.stringify(a));
    return;
  }
  var x = JSON.parse(getCookie());
  x.push(score);
  x.sort(function(a, b) {
    return b - a;
  });
  if (x.length > 5) x = x.slice(0, 5);
  // document.cookie = JSON.stringify(x);
  setCookie(JSON.stringify(x));
}
function preload() {
  this.load.baseURL = 'https://examples.phaser.io/assets/';
  this.load.crossOrigin = 'anonymous';
  this.load.image('ship', 'games/defender/ship.png');
  this.load.image('bullet', 'games/orbit/ball.png');
  this.load.image('enemybullet', 'games/invaders/enemy-bullet.png');
  this.load.image('background', 'games/invaders/starfield.png');
  this.load.image('star', 'games/starstruck/star.png');
  this.load.spritesheet('boss', 'sprites/invaderpig.png', {
    frameWidth: 128,
    frameHeight: 104
  });
  this.load.image('miniboss', 'games/invaders/invader.png');
  this.load.image('rock', 'games/asteroids/asteroid2.png');
  this.load.spritesheet('enemy', 'games/starstruck/droid.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}
var fizyka;
function updateHP(hp, t) {
  t.setText('HP: ' + hp);
}
function updateBossHP(hp) {
  BossHPText.setText('HP: ' + hp);
}
function create() {
  let back = this.add.tileSprite(0, 0, 680, 400, 'background');
  back.setOrigin(0);
  back.setScrollFactor(0);
  var style = {
    font: 'bold 19px Arial',
    fill: '#ff6666',
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  };
  var style2 = {
    font: 'bold 19px Arial',
    fill: '#99ff99',
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  };
  var style3 = {
    font: 'bold 19px Arial',
    fill: '#66ccff',
    boundsAlignH: 'center',
    boundsAlignV: 'middle'
  };
  this.ScoreText = this.add.text(550, 360, 'SCORE: 0', style3);
  this.ScoreText.setShadow(3, 3, 'rgba(1,0,1,1)', 2);
  this.LvLText = this.add.text(20, 30, 'LVL: 0', style2);
  this.LvLText.setShadow(3, 3, 'rgba(1,0,1,1)', 2);

  this.HPText = this.add.text(20, 10, 'HP: 100', style2);
  this.HPText.setShadow(3, 3, 'rgba(1,0,1,1)', 2);
  //this.HPText.addColor('#00ff00', 3);
  //this.HPText.setTextBounds(0, 100, 800, 100);

  this.BossHPText = this.add.text(570, 10, 'BOSS (~)', style);
  this.BossHPText.setShadow(3, 3, 'rgba(1,0,1,1)', 2);
  //this.BossHPText.setTextBounds(0, 100, 800, 100);
  ship = this.physics.add.sprite(150, 380, 'ship');
  ship.setOrigin(0.5);
  ship.body.collideWorldBounds = true;
  ship.body.immovable = true;

  this.enemies = this.physics.add.group();
  this.rocks = this.physics.add.group();
  this.bullets = this.physics.add.group();
  this.enemyBullets = this.physics.add.group();
  this.starGroup = this.physics.add.group();
  this.bossGroup = this.physics.add.group();
  this.miniBossGroup = this.physics.add.group();
  this.HPText.setText('HP: ' + PlayerHP);

  this.anims.create({
    key: 'fly',
    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  startNextLevel(
    this.physics,
    this.enemies,
    this.rocks,
    this.bossGroup,
    this.miniBossGroup,
    this.damageBoss
  );
  this.fizyka = this.physics;
  this.physics.add.collider(this.bullets, this.miniBossGroup, function(
    bull,
    enem
  ) {
    enem.body.velocity.x = 0;
    enem.hp--;
    bull.disableBody(true, true);
    console.log(enem.hp);
    if (enem.hp <= 0) {
      enem.disableBody(true, true);
    }
  });
  var p = this.physics;
  this.physics.add.collider(this.bullets, this.bossGroup, function(bull, enem) {
    if (enem.dmg) {
      enem.body.velocity.x = 0;
      enem.hp--;
      //BHP.innerHTML = 'BOSS (OSŁABIONY): ' + enem.hp;
      bossHPmess = 'BOSS: (' + boss.hp + ')';
      bull.disableBody(true, true);
      console.log('boss:' + enem.hp);
      if (enem.hp <= 0) {
        enem.disableBody(true, true);
        bossHPmess = '';
        this.level++;
        this.damageBoss = false;
        enemiesCount--;
      }
    } else {
      enem.body.velocity.x = 0;
      bull.disableBody(true, true);
    }
  });
  this.physics.add.collider(this.bullets, this.enemies, function(bull, enem) {
    enem.body.velocity.x = 0;
    bull.disableBody(true, true);
    enem.hp--;
    if (enem.hp <= 0) {
      enem.disableBody(true, true);
      enemiesCount--;
    }
  });
  this.physics.add.collider(this.miniBossGroup, ship, function(ship, bull) {
    bull.disableBody(true, true);
    PlayerHP--;
    //HPP.innerHTML = 'HP: ' + PlayerHP;
    if (PlayerHP == 0) {
      ship.disableBody(true, true);
      gameoverText.visible = true;
      addScore();
    }
  });
  this.physics.add.collider(this.enemyBullets, ship, function(ship, bull) {
    bull.disableBody(true, true);
    PlayerHP--;
    //HPP.innerHTML = 'HP: ' + PlayerHP;
    if (PlayerHP == 0) {
      ship.disableBody(true, true);
      gameoverText.visible = true;
      addScore();
    }
  });
  this.physics.add.collider(this.rocks, ship, function(ship, rock) {
    rock.disableBody(true, true);
    PlayerHP--;
    //HPP.innerHTML = 'HP: ' + PlayerHP;
    if (PlayerHP == 0) {
      ship.disableBody(true, true);
      gameoverText.visible = true;
      addScore();
    }
  });
  gameoverText = this.add.text(
    this.physics.world.bounds.centerX,
    200,
    'GAME OVER',
    { font: '40px Arial', fill: '#ff3300', align: 'center' }
  );
  gameoverText.setOrigin(0.5);
  gameoverText.visible = false;
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  counter++;
  shootCooldown++;
  scoreCount++;
  rockTime++;
  movement();
  //update text HP
  if (this.HPText.text != 'HP: ' + PlayerHP) {
    this.HPText.setText('HP: ' + PlayerHP);
  }
  if (this.BossHPText.text != bossHPmess) {
    this.BossHPText.setText(bossHPmess);
  }
  if (this.ScoreText.text != 'SCORE: ' + score) {
    this.ScoreText.setText('SCORE: ' + score);
  }
  if (this.LvLText.text != 'LVL: ' + level) {
    this.LvLText.setText('LVL: ' + level);
  }
  //shooting
  if (cursors.space.isDown && counter > 20) {
    counter = 0;
    bullet = this.physics.add.sprite(ship.x, ship.y, 'bullet');
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
  //clear bullets
  for (var i = 0; i < this.bullets.getChildren().length; i++) {
    var bull = this.bullets.getChildren()[i];
    if (bull.x >= 655) {
      bull.disableBody(true, true);
      this.bullets.remove(bull, true, true);
    }
  }
  if (shootCooldown > 200) {
    this.game.paused = !this.game.paused;

    shootCooldown = 0;
    var index = Math.floor((Math.random() * 100) % (level % 5));

    try {
      while (this.enemies.getChildren()[index].hp <= 0) {
        index++;
        if (index >= level % 5) {
          index = 0;
        }
      }
      enemyBullet = this.physics.add.sprite(
        this.enemies.getChildren()[index].x,
        this.enemies.getChildren()[index].y,
        'enemybullet'
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
  if (rockTime > 300) {
    flyingRock = this.physics.add.sprite(670, ship.y, 'rock');
    flyingRock.setOrigin(0.5);
    flyingRock.body.immovable = true;
    this.rocks.add(flyingRock);
    try {
      rockTime = 0;

      //var index = Math.floor((Math.random() * 100) % enemiesCount);

      for (var i = 0; i < this.rocks.getChildren().length; i++) {
        var r = this.rocks.getChildren()[i];
        r.setOrigin(0.5, 0.5);
        r.body.setCollideWorldBounds(false);

        r.body.onWorldBounds = true;
        r.body.velocity.x = -100;
      }
      //flyingRock.body.velocity.x = -250;
    } catch {}
  }
  if (this.rocks.getChildren().length != 0) {
    for (var i = 0; i < this.rocks.getChildren().length; i++) {
      var r = this.rocks.getChildren()[i];
      if (ship.x > r.x) continue;
      var ile = ship.y > r.y ? 50 : -50;
      r.body.velocity.y = ile;
    }
  }
  //miniboss zachowanie
  if (this.miniBossGroup.getChildren().length != 0) {
    for (var i = 0; i < this.miniBossGroup.getChildren().length; i++) {
      var r = this.miniBossGroup.getChildren()[i];
      //if (ship.x > r.x) continue;
      var ile = ship.y > r.y ? 50 : -50;
      var ileX = ship.x > r.x ? 50 : -50;
      r.body.velocity.y = ile;
      if (0 < r.x) r.body.velocity.x = ileX - Math.random() * 25;
      else {
        r.body.velocity.x = 0;
        r.disableBody(true, true);
        this.miniBossGroup.remove(r, true, true);
      }
    }
  }
  if (scoreCount > 600) {
    scoreCount = 0;
    star = this.physics.add.sprite(680, (Math.random() * 1000) % 400, 'star');
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
      //scoreID.innerHTML = 'Score: ' + score;
    });
  }
  if (enemiesCount == 0) {
    this.enemies.clear(true);
    startNextLevel(
      this.physics,
      this.enemies,
      this.rocks,
      this.bossGroup,
      this.miniBossGroup,
      this.damageBoss
    );
  }
}
function startNextLevel(
  physics,
  enemies,
  rocks,
  bossGroup,
  miniBossGroup,
  damageBoss
) {
  // var physics = this.physics;
  //physics = Phaser.Physics;
  level++;
  if (level % 5 != 0) {
    enemiesCount = level % 5;

    for (var i = 1; i <= enemiesCount; i++) {
      enemy = physics.add.sprite(500, 60 * i, 'enemy');
      enemy.hp = Math.floor(level / 5) + 1;
      enemy.setOrigin(0.5);
      enemy.body.immovable = true;
      enemies.add(enemy);
    }

    for (var i = 0; i < enemies.getChildren().length; i++) {
      var enem = enemies.getChildren()[i];
      enem.anims.play('fly', true);
    }
  } else {
    //spawnBoosa
    damageBoss = false;
    //BHP.innerHTML = 'BOSS (NIEŚMIERTELNY)';
    bossHPmess = 'BOSS: (~)';
    enemiesCount = 1;
    boss = physics.add.sprite(490, 200, 'boss');

    boss.hp = level * 2;
    boss.dmg = false;
    for (var ind = 0; ind < 6; ind++) {
      miniBoss = physics.add.sprite(490 - 10 * ind, 200 + 15 * ind, 'miniboss');
      //miniBoss.body.velocity.x = -350;
      miniBoss.hp = Math.floor(level / 5);
      miniBossGroup.add(miniBoss);
    }
    setTimeout(function() {
      for (var ind = 0; ind < 6; ind++) {
        miniBoss = physics.add.sprite(
          490 - 10 * ind,
          200 + 10 * ind,
          'miniboss'
        );
        miniBoss.hp = Math.floor((level * 1.5) / 5);
        miniBossGroup.add(miniBoss);
      }
    }, 7000);

    setTimeout(function() {
      //BHP.innerHTML = 'BOSS (OSŁABIONY): ' + boss.hp;
      bossHPmess = 'BOSS: (' + boss.hp + ')';
      boss.dmg = true;
    }, 12000);
    setTimeout(function() {
      boss.dmg = false;
      //BHP.innerHTML = 'BOSS (NIEŚMIERTELNY)';
      bossHPmess = 'BOSS: (~)';
      for (var ind = 0; ind < 6; ind++) {
        miniBoss = physics.add.sprite(
          490 - 10 * ind,
          200 + 10 * ind,
          'miniboss'
        );
        miniBoss.hp = Math.floor((level * 2) / 5);
        miniBossGroup.add(miniBoss);
      }
    }, 15000);
    setTimeout(function() {
      //BHP.innerHTML = 'BOSS (OSŁABIONY): ' + boss.hp;
      bossHPmess = 'BOSS: (' + boss.hp + ')';
      boss.dmg = true;
    }, 25000);

    enemy.body.immovable = true;
    bossGroup.add(boss);
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
function setCookie(v) {
  var d = new Date();
  d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = 'top=' + v + ';' + expires + ';path=/';
}
function getCookie() {
  var name = 'top=';
  var cc = document.cookie.split(';');
  for (var i = 0; i < cc.length; i++) {
    var c = cc[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
