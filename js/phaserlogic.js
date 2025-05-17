const phaserConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,

    scale: {
        // mode: Phaser.Scale.NONE,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
        // resolution: 2,
        // zoom:2,
    },
    parent: 'game-container', //Set html elem as parent
    physics: {
        default: 'matter',
        matter: {
            gravity: {  y: 9.8 * 60},
            debug: {
                // showAxes: false,
                       showAngleIndicator: true,
                //        angleColor: 0xe81153,
                //        showBroadphase: false,
                //        broadphaseColor: 0xffb400,
                //        showBounds: false,
                //        boundsColor: 0xffffff,
                       showVelocity: true,
                //        velocityColor: 0x00aeef,
                //        showCollisions: false,
                //        collisionColor: 0xf5950c,
                //        showSeparations: false,
                //        separationColor: 0xffa500,
                //        showBody: true,
                //        showStaticBody: true,
                //        showInternalEdges: false,
                //        renderFill: false,
                //        renderLine: true,
                //        fillColor: 0x106909,
                //        fillOpacity: 1,
                //        lineColor: 0x28de19,
                //        lineOpacity: 1,
                //        lineThickness: 1,
                //        staticFillColor: 0x0d177b,
                //        staticLineColor: 0x1327e4,
                //        showSleeping: false,
                //        staticBodySleepOpacity: 0.7,
                //        sleepFillColor: 0x464646,
                //        sleepLineColor: 0x999a99,
                //        showSensors: true,
                //        sensorFillColor: 0x0d177b,
                //        sensorLineColor: 0x1327e4,
                //        showPositions: true,
                //        positionSize: 4,
                //        positionColor: 0xe042da,
                //        showJoint: true,
                //        jointColor: 0xe0e042,
                //        jointLineOpacity: 1,
                //        jointLineThickness: 2,
                //        pinSize: 4,
                //        pinColor: 0x42e0e0,
                //        springColor: 0xe042e0,
                //        anchorColor: 0xefefef,
                //        anchorSize: 4,
                //        showConvexHulls: false,
                //        hullColor: 0xd703d0
            },
            timing: {
                timeScale: 1/60 // Make calculations in seconds instead of steps
            }

        }
    },
    scene: {
        preload,
        create,
        update
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
};

const game = new Phaser.Game(phaserConfig);
let testObj, ground, testObjB, tria


function preload() {
    this.load.image('obj', 'img/items/shield.svg');
    this.load.image('background', 'img/bg/10x5 grid.svg');
    this.load.image('obj2', 'img/items/wizards head.svg');
    this.load.image('circle', 'img/phaser/circle.svg');
}

function create() {

    //ENVIRONMENT
    //Add the background image to the scene
    const cw = this.sys.game.config.width;  // Get canvas width
    const ch = this.sys.game.config.height; // Get canvas height
    const bg = this.add.image(cw/2, ch/2, 'background');
    // const bg = this.add.image(cw, ch, 'background');


    //World boundaries
    // this.matter.world.setBounds(0, 0, this.sys.game.config.width, this.sys.game.config.height);

    //GROUND
    const groundRect = this.add.rectangle(500, 450, 1200, 20, 0x909090);
    ground = this.matter.add.gameObject(groundRect, {
        isStatic: true,
        angle: 0.05 * Math.PI,
        friction: 0.1,
        frictionStatic: 1,
    });
    ground.setFriction(99);


    //Ball
    testObj = this.matter.add.image(50, 300, 'circle');
    //  Change the body to a Circle with a radius of 48px
    testObj.setBody({
        type: 'circle',
        radius: 50,
    });
    testObj.setFriction(99);
    // testObj.setFrictionStatic(9);

    // testObj.setBounce(0);
    // testObj.setMass(0.5);

    //Triangle
    //Create the visual representation
    const triangleGraphics = this.add.graphics();
    triangleGraphics.fillStyle(0xFF0000, 1);  // Red color
    triangleGraphics.fillTriangle(0, -100, 86, 50, -86, 50);

    //Create physics body
    const triangleBody = this.matter.add.fromVertices(
        800, 150,  // x, y position
        [
            { x:   0, y: -100 },
            { x:  86, y:   50 },
            { x: -86, y:   50 }
        ],
        {
            isStatic: false,
            friction: 99
        }
    );

    // Link the graphics to the physics body
    triangleGraphics.x = 500;
    triangleGraphics.y = 150;
    tria = this.matter.add.gameObject(triangleGraphics, triangleBody);


    //Circle
    // const circleBody = this.add.circle(800, 0, 25, 0x909090);
    // this.matter.add.gameObject(circleBody, {
    //     circleRadius: 25,  // This explicitly creates a circular physics body
    //
    //     // physics properties
    //     friction: 0.7,
    //     frictionStatic: 10,
    //     restitution: 0,
    // });

    // testObjB = this.matter.add.image(0, 400, 'obj2');
    // testObjB.setRectangle(52,52); // Set the collider as a circle
    // testObjB.setBounce(0);
    // testObjB.setMass(500); // Set mass to 2 units (kg if using realistic physics)

    //Collision detection
    // this.matter.world.on('collisionstart', function(event, bodyA, bodyB) {
    //
    //     // You can check which objects are colliding
    //     if (bodyA.gameObject === testObj && bodyB.gameObject === testObjB) {
    //         console.log('Collision:', bodyA, bodyB);
    //     }
    // });

}

//Vars
let frameCounter = 0;

function update() {

    // // Trigger every N frames
    frameCounter++;

    interval(updateLog, msToFrames(100))
    // // interval(() => v(1,-3.8), msToFrames(4000))
}


//UTILITY
function updateLog(){
    el('game-log').innerHTML =`
        <p>
                v_x:
            <br>v_y:
            <br>m:
            <br>fps:
        </p>
        <p>
                ${pxToM(testObj.body.velocity.x.toFixed(0))} m\/s 
            <br>${pxToM(testObj.body.velocity.y.toFixed(0))} m\/s
            <br>${testObj.body.mass.toFixed(0)} kg
            <br>${game.loop.actualFps.toFixed(0)}
        </p>
    `
}

function interval(func, delay){
    if (frameCounter % delay === 0) {
        return func()
    }
}

function v(x,y){
    testObj.setVelocity(m(x),m(y));
    // console.log('Velocity modified')
}

function xy(x,y){
    testObj.setPosition(m(x),m(y));
}

function m(val){
    return val * 50 //Multiplies value by 50px -> 50px = 1meter
}

function pxToM(val){
    return val / 50
}

function msToFrames(val){
    return val * 0.06
}

function logBody(elem){
    console.table(elem.body, ['friction'])
}



// Apply force to an object
function applyForce(gameObject, forceX, forceY) {
    // Access the scene through the game object
    gameObject.scene.matter.body.applyForce(
        gameObject.body,                     // The body to apply force to
        { x: gameObject.x, y: gameObject.y }, // Point to apply force (center of object)
        { x: forceX, y: forceY }             // Force vector
    );
}
