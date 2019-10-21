var p = {
    x: 0.5*s,
    y: 0.5 *s,
    onGround: false,
    size: 0.05 * s,
    velocityY: 0,
    draw: function () {
        ctx.fillStyle = "black";
        ctx.fillRect(p.x - (p.size / 2), p.y - p.size, p.size, p.size);
    },
    top: function () {
        return p.y - p.size;
    },
    bottom: function () {
        return p.y;
    },
    right: function () {
        return p.x + (p.size / 2);
    },
    left: function () {
        return p.x - (p.size / 2);
    },
    centerY: function () {
        return p.y - (p.size / 2);
    }
};

function getP() {
    return p;
}

function setP(pl){
    p = pl;
}

function moveActivePlayer() {
    var speed = 0.005 * s;
    var gravity = 0.0006 * s;
    p.velocityY += gravity;

    //a
    if (keyDown[65]) {
        p.x -= speed;
    }

    //d
    if (keyDown[68]) {
        p.x += speed;
    }

    if (keyDown[87] && collidingWithPlatform(p)) {
        var collidePlats = collidingWithPlatform(p);
        for (var i = 0; i < collidePlats.length; i++) {
            if (collisionSide(p, collidePlats[i]) == "top") {
                p.velocityY = -0.015 * s;
            }
        }
    }

    p.y += p.velocityY;

    if (collidingWithPlatform(p) != []) {
        var collidePlats = collidingWithPlatform(p);
        for (var i = 0; i < collidePlats.length; i++) {
            switch (collisionSide(p, collidePlats[i])) {
                case "left":
                    p.x = collidePlats[i].left() - (p.size / 2);
                    break;
                case "right":
                    p.x = collidePlats[i].right() + (p.size / 2);
                    break;
                case "top":
                    p.y = collidePlats[i].top();
                    p.velocityY = 0;
                    break;
                case "bottom":
                    p.y = collidePlats[i].bottom() + p.size;
                    p.velocityY = 0;
                    break;
            }
        }
    }
}

function colliding(a, b) {
    return ((a.bottom() >= b.top() && a.bottom() <= b.bottom() && ((a.right() >= b.left() && a.right() <= b.right()) || (a.left() <= b.right() && a.left() >= b.left()))) || /*Next*/(a.top() <= b.bottom() && a.top() >= b.top() && ((a.right() >= b.left() && a.right() <= b.right()) || (a.left() <= b.right() && a.left() >= b.left()))) || /*Next*/(a.right() >= b.left() && a.right() <= b.right() && ((a.bottom() >= b.top() && a.bottom() <= b.bottom()) || (a.top() <= b.bottom() && a.top() >= b.top()))) || /*Next*/(a.left() <= b.right() && a.left() >= b.left() && ((a.bottom() >= b.top() && a.bottom() <= b.bottom()) || (a.top() <= b.bottom() && a.top() >= b.top()))));
}

function collidingWithPlatform(p) {
    var collidePlats = [];
    for (var i = 0; i < platforms.length; i++) {
        if (colliding(p, platforms[i])) {
            collidePlats[collidePlats.length] = platforms[i];
        }
    }
    if (collidePlats == []) {
        return false;
    }
    return collidePlats;
}

//returns a is _____ of b
function collisionSide(a, b) {
    var angle = angleBetween(b.centerX(), b.centerY(), a.x, a.centerY());
    if ((angle <= b.topLeftAngle() && angle >= 0) || (angle >= b.bottomLeftAngle() && angle <= 360)) {
        return "left";
    } else if (angle <= b.bottomLeftAngle() && angle >= b.bottomRightAngle()) {
        return "bottom";
    } else if (angle <= b.bottomRightAngle() && angle >= b.topRightAngle()) {
        return "right";
    } else {
        return "top";
    }
}

function angleBetween(x1, y1, x2, y2) {
    var a = Math.atan2((y1 - y2), (x1 - x2)) * 180 / Math.PI;
    while (a < 0) {
        a += 360;
    }
    return a;
}

function Platform(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    platforms[platforms.length] = this;

    this.type = 0;
    if (this.x > s / 2) this.type = 1;

    this.top = function () {
        return this.y;
    }
    this.bottom = function () {
        return this.y + this.h;
    }
    this.left = function () {
        return this.x;
    }
    this.right = function () {
        return this.x + this.w;
    }
    this.centerX = function () {
        return this.x + (w / 2);
    }
    this.centerY = function () {
        return this.y + (h / 2);
    }
    this.topRightAngle = function () {
        return angleBetween(this.centerX(), this.centerY(), this.right(), this.top());
    }
    this.topLeftAngle = function () {
        return angleBetween(this.centerX(), this.centerY(), this.left(), this.top());
    }
    this.bottomLeftAngle = function () {
        return angleBetween(this.centerX(), this.centerY(), this.left(), this.bottom());
    }
    this.bottomRightAngle = function () {
        return angleBetween(this.centerX(), this.centerY(), this.right(), this.bottom());
    }

    this.draw = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, w, h);
    }
}

function drawPlatforms() {
    for (var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }
}