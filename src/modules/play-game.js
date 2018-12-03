'use strict';

/**
 * `PlayGame`
 * Main Phaser scene to play the game.
 */
class PlayGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');

    this.EG = {
      cursors: null,
      firstPlay: true,
      player: null,
      starfield: null,
    };
  }

  // Starfield background.
  // Note: the scrollFactor values create the 'parallax' effect.
  // Source: http://labs.phaser.io/edit.html?src=src\games\defenda\test.js
  createStarfield () {
    this.EG.starfield = this.add.group({ key: 'star', frameQuantity: 128 });
    this.EG.starfield.createMultiple({ key: 'big-star', frameQuantity: 16 });
    this.EG.starfield.createMultiple({ key: 'edwina-star', frameQuantity: 24 });

    const rect = new Phaser.Geom.Rectangle(0, 0, 367, 2000);
    Phaser.Actions.RandomRectangle(this.EG.starfield.getChildren(), rect);

    this.EG.starfield.children.iterate((child) => {
      let sf = Math.max(0.3, Math.random());
      if (child.texture.key === 'big-star') sf = 0.2;
      if (child.texture.key === 'edwina-star') sf = 0.3;
      child.setScrollFactor(sf);
    }, this);
  }

  create() {
    this.cameras.main.setBounds(0, 0, 367, 2000);

    this.createStarfield();

    this.anims.create({
      key: 'twinkle',
      frames: this.anims.generateFrameNames(
        'edwina-star',
        {
          frames: [0, 1, 2],
        }
      ),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: 'twinkle2',
      frames: this.anims.generateFrameNames(
        'edwina-star',
        {
          frames: [1, 0, 2],
        }
      ),
      frameRate: 2,
      repeat: -1,
    });


    this.EG.player = this.impact.add.sprite(183.5, 600, 'ship').setDepth(1);
    this.EG.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();

    this.EG.cursors = this.input.keyboard.createCursorKeys();
  }

  // Game loop function that gets called continuously unless a game over.
  update() {
    if (this.EG.cursors.up.isDown)
    {
      this.EG.player.setAccelerationY(-50);
    } else {
      this.EG.player.setAccelerationX(0);
    }

    this.EG.starfield.children.entries
      .filter(child => child.texture.key === 'edwina-star')
      .map((edwinaStar, index) => {
        if (index % 2 === 0) { 
          edwinaStar.anims.play('twinkle', true);
        } else {
          edwinaStar.anims.play('twinkle2', true);
        }
      });

    //  Position the center of the camera on the player
    //  We set -333.5 because the camera height is 667px and
    //  we want the center of the camera on the player.
    this.cameras.main.scrollY = this.EG.player.y - 333.5;
  }
}

export default PlayGame;
