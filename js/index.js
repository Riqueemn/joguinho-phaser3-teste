/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var platforms;
    var game = new Phaser.Game(config);

    function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png',{ frameWidth: 32, frameHeight: 48 });
    this.load.image('controle', 'assets/controle.png');
}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var controle;
var left;
var up;
var right;
var b;
var c;
var d;

function create ()
{
    window.addEventListener('resize', resize);
    resize();
    function resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
     
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    }); 

    stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
});

stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

this.physics.add.collider(stars, platforms);

this.physics.add.overlap(player, stars, collectStar, null, this);





function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
{
    stars.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

}
}

scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

bombs = this.physics.add.group();

this.physics.add.collider(bombs, platforms);
this.physics.add.collider(player, bombs, hitBomb, null, this);

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

left = this.add.sprite(50, 570, 'controle').setScale(4);




up = this.add.sprite(80, 520, 'controle').setScale(4);
right = this.add.sprite(110, 570, 'controle').setScale(4);








            

    
}

function update ()
{     

    cursors = this.input.keyboard.createCursorKeys();

    left.setInteractive();
    up.setInteractive();
    right.setInteractive();

left.on('pointerout', function(){
    b = false;

});

left.on('pointerdown', function(){
    b = true;

});

up.on('pointerout', function(){
    c = false;

});

up.on('pointerdown', function(){
    c = true;

});

right.on('pointerout', function(){
    d = false;

});

right.on('pointerdown', function(){
    d = true;

});



    this.physics.add.collider(player, platforms);

    if (b || cursors.left.isDown)
    {
    player.setVelocityX(-160);

    player.anims.play('left', true);
    }
    else if (d|| cursors.right.isDown)
    {
    player.setVelocityX(160);

    player.anims.play('right', true);
    }
    else
    {
    player.setVelocityX(0);

    player.anims.play('turn');
    }

    if ((c ||cursors.up.isDown) && player.body.touching.down)
    {
    player.setVelocityY(-330);
    }
}

});
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();