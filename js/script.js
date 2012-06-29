
$(document).ready(function() {

    var cv = $('#main-canvas');
    var timeStart = new Date();
    var timeLast = timeStart;
    var timeNow = timeStart;
    var deltaLast = 0;
    var deltaEver = 0;
    var particles = new Array();
    var running = true;
    var debug = false;

    var FRAMESPEED = 20.0;
    var EMITTER_X = 470.0;
    var EMITTER_Y = 300.0;
    var EMITTER_ATTRACTION = 1100.0;
    var EMITTER_FREQUENCY = 200;
    var MAX_PARTICLES = 100;
    var ticker = EMITTER_FREQUENCY;

    var mainloop = function() {
        if (running) {
            update();
            draw();
        }
    };

    var update = function() {

        timeLast = timeNow;
        timeNow = new Date();
        deltaLast = timeNow - timeLast;
        deltaEver = timeNow - timeStart;
        //console.log("update: time since last delta is " + (timeNow - timeLast)  + "ms, time since start is " + (timeNow - timeStart) + "ms");

        if (ticker <= 0) {
            if (particles.length < MAX_PARTICLES)
                particles.push(new createParticle());

            ticker = EMITTER_FREQUENCY;
        } else {
            ticker -= deltaLast;
        }

        if (deltaEver > 20000)
            running = false;
    }

    var draw = function() {

        cv.clearCanvas();

        //emitter
        cv.drawArc({
            strokeStyle: "#933",
            fillStyle: "#C99",
            strokeWidth: 1,
            x: EMITTER_X, y: EMITTER_Y,
            radius: 6
        });

        //particles
        var tot = particles.length;
        for (var i = 0; i < tot; i++) {
            thisPart = particles[i];
            if (thisPart.alive) {
                updateParticle(thisPart);
                drawParticle(thisPart);
            }
        }

    }

    var updateParticle = function(particle) {
        attractTowardsEmitter(particle);
        particle.x += particle.vx;
        particle.y += particle.vy;
    }

    var drawParticle = function(particle) {
        cv.drawArc({
            fillStyle: "#CCC",
            x: particle.x, y: particle.y,
            radius: particle.radius
        });
    }

    var attractTowardsEmitter = function(particle) {
        var xdist = EMITTER_X - particle.x;
        var ydist = EMITTER_Y - particle.y;
        var distanceSq = (xdist * xdist) + (ydist * ydist);
        var attraction = EMITTER_ATTRACTION / FRAMESPEED / distanceSq; //massive simplification
        var direction = Math.atan2(xdist, ydist);
        var attractionX = Math.sin(direction) * attraction;
        var attractionY = Math.cos(direction) * attraction;
        particle.vx += attractionX;
        particle.vy += attractionY;

        if (distanceSq > 372500) // outside view area
            particle.alive = false;

        if (debug) {
            console.log("now particle at ["+particle.x.toFixed(2)+","+particle.y.toFixed(2)+"] with velocity ["+particle.vx.toFixed(2)+","+particle.vy.toFixed(2)+"]");
            console.log("xdist: " +xdist+ ", ydist: " +ydist);
            console.log("distanceSq: " +distanceSq);
            console.log("attraction: " +attraction);
            console.log("direction: " +direction);
            console.log("attractionX: " +attractionX+ ", attractionY: " +attractionY);
        }
    }

    var createParticle = function() {
        var speedlimiter = 100.0 / FRAMESPEED;
        this.x = EMITTER_X + (Math.random()*8-4)*speedlimiter;
        this.y = EMITTER_Y + (Math.random()*8-4)*speedlimiter;
        this.vx = (Math.random()*2-1)*speedlimiter;
        this.vy = (Math.random()*2-1)*speedlimiter;

        //this.vx = 5.0;
        //this.vy = 2.0;

        //var r = Math.random()*255>>0;
        //var g = Math.random()*255>>0;
        //var b = Math.random()*255>>0;
        //this.color = "rgba("+r+", "+g+", "+b+", 0.5)";
        this.alive = true;
        this.radius = 2;
        this.x += this.vx;
        this.y += this.vy;

        if (debug)
            console.log("created particle at ["+this.x+","+this.y+"] with velocity ["+this.vx+","+this.vy+"]");
    }

    var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null ;

    if ( animFrame !== null ) {
        var recursiveAnim = function() {
            mainloop();
            animFrame( recursiveAnim, cv );
        };

        // start the mainloop
        animFrame( recursiveAnim, cv );
    } else {
        var ONE_FRAME_TIME = 1000.0 / 60.0 ;
        setInterval( mainloop, ONE_FRAME_TIME );
    }

});

