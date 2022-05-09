const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  heigth: 640,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create,
    update,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
    },
  }
};

const game = new Phaser.Game(config);

function preload() {
  
  this.load.image('background', 'assets/images/background.png');
 
  this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');
 
  this.load.image('spike', 'assets/images/spike.png');

  this.load.tilemapTiledJSON('map', 'assets/tilemaps/level1.json');
 
  this.load.atlas('player', 'assets/images/kenney_player.png',
    'assets/images/kenney_player_atlas.json');
}

function create() {
 
  const map = this.make.tilemap({ key: 'map' });
 
  const tileset = map.addTilesetImage('kenney_simple_platformer', 'tiles');
 
  const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
  
  backgroundImage.setScale(2, 0.8);
 
  const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);
 
  platforms.setCollisionByExclusion(-1, true);

 
  this.player = this.physics.add.sprite(50, 300, 'player');
  this.player.setBounce(0.3); // our player will bounce from items
  this.player.setCollideWorldBounds(true); // don't go out of the map
  this.physics.add.collider(this.player, platforms);

  
  this.player = this.physics.add.sprite(50, 300, 'player');
  this.player.setBounce(0.1); 
  this.player.setCollideWorldBounds(true); 
  this.physics.add.collider(this.player, platforms);

 
  this.anims.create({
    key: 'idle',
    frames: [{ key: 'player', frame: 'robo_player_0' }],
    frameRate: 10,
  });

  
  this.anims.create({
    key: 'jump',
    frames: [{ key: 'player', frame: 'robo_player_1' }],
    frameRate: 10,
  });

  this.cursors = this.input.keyboard.createCursorKeys();

  
  this.spikes = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  
  map.getObjectLayer('Spikes').objects.forEach((spike) => {
    
    const spikeSprite = this.spikes.create(spike.x, spike.y + 200 - spike.height, 'spike').setOrigin(0);
   
    spikeSprite.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

  
  this.physics.add.collider(this.player, this.spikes, playerHit, null, this);
}

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-300);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(300);
    if (this.player.body.onFloor()) {
      this.player.play('walk', true);
    }
  } else {
   
    this.player.setVelocityX(0);
   
    if (this.player.body.onFloor()) {
      this.player.play('idle', true);
    }
  }

 
  if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.player.body.onFloor()) {
    this.player.setVelocityY(-350);
    this.player.play('jump', true);
  }

 
  if (this.player.body.velocity.x > 0) {
    this.player.setFlipX(false);
  } else if (this.player.body.velocity.x < 0) {
  
    this.player.setFlipX(true);
  }
 
}

/**
 * playerHit resets the player's state when it dies from colliding with a spike
 * @param {*} player - player sprite
 * @param {*} spike - spike player collided with
 */
function playerHit(player, spike) {
  
  player.setVelocity(0, 0);
 
  player.setX(50);
  player.setY(300);
  
  player.play('idle', true);

  player.setAlpha(0);
  
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: 'Linear',
    repeat: 5,
  });
}
