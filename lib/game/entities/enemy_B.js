ig.module(
	'game.entities.enemy_B'
)
.requires(
	'impact.entity',
	'game.entities.enemyBullet',
)
.defines(function(){
	
	EntityEnemy_B = ig.Entity.extend({

		size: {x: 97, y: 70},
		offset: {x: 4, y:0},
		maxVel: {x: 100, y: 100},
		friction: {x: 150, y: 0},
		
		type: ig.Entity.TYPE.B, // Evil enemy group
		checkAgainst: ig.Entity.TYPE.A, // Check against friendly
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		health: 1,
		canFire: false,
		fireRate: 1, //in second(s)

		speed: 36,
		flip: false,
		
		animSheet: new ig.AnimationSheet( 'media/ship_2_r2.png', 97, 70 ),
		sfxShoot: new ig.Sound( 'media/sounds/shoot1.ogg' ),
		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.shootTimer = new ig.Timer(this.fireRate);
			this.addAnim( 'idle', 1, [0] );
			this.currentAnim = this.anims.idle;
			this.spawnerR = ig.game.getEntitiesByType( EntityEnemySpawnerR )[0];
			this.spawnerL = ig.game.getEntitiesByType( EntityEnemySpawnerL )[0];
			this.base = ig.game.getEntitiesByType( EntityBase )[0];
		},
		
		
		update: function() {
			this.currentAnim.flip.x = !this.flip;
			this.move_few_distance();
			if(this.canFire && this.base.health != 0){
				if(this.shootTimer.delta() >= this.fireRate){
					this.shoot_bullet();
				}
			}
			this.parent();
		},

		shoot_bullet: function(){
			var target = {
				x: 320,
				y: 320
			}
			var ship = {
				x: this.pos.x, 
				y: this.pos.y
			}
			this.sfxShoot.play();
			ig.game.spawnEntity( EntityEnemyBullet, this.flip ? this.pos.x : this.pos.x+75, this.pos.y+18, {flip:this.flip, target:target, ship:ship} );
			this.shootTimer.reset();
		},

		move_few_distance: function(){
			var x = !this.flip ? 50 : 610;
			var distance_x = x - this.pos.x - this.size.x / 2;
			if ( Math.floor(distance_x) == 0 ) { 
				distance_x = 0;
				this.canFire = true;
			}
			this.vel.x = (distance_x > 1 ? 1 : -1) * this.speed * (Math.abs(distance_x) / (Math.abs(distance_x)));
		},

		kill: function() {
			this.parent();
			this.base.enemyCount2--;
			this.base.enemyCount3--;
			if( this.base.enemyCount2 == 0 ) {
				if( this.base.enemyCount1 == this.base.maxEnemyCount ) {
					this.base.isWaveComplete = true;
				}
				else {
					this.spawnerR.canSummon = true;
					this.spawnerL.canSummon = true;
				}
			}
		},
		
		check: function( other ) {
			other.receiveDamage( 1, this );
		}
	});

});