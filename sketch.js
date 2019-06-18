let grid;
let environment;

const MARGIN = [2, 2, 2, 2] // left, top, right, bottom
let STRIDE = 50

let CHARGE_UNIT = 1e-6
let DISTANCE_UNIT = 1e-2

let NEW_CHARGE_TYPE = CHARGE_UNIT

let UNDO = false

function setup() {
    generateGrid()
    let cnv = createCanvas(windowWidth, windowHeight)
    cnv.parent("canvas-container")
    cnv.mousePressed(mousePressedC)
    main()
}

function generateGrid() {
    let width = Math.floor((windowWidth - MARGIN[0] - MARGIN[2]) / STRIDE)
    let height = Math.floor((windowHeight - MARGIN[1] - MARGIN[3]) / STRIDE)
    grid = new L.grid(width, height)
    environment = new L.field(grid, 0)
}

function getFixedX(x) {
    return x * STRIDE + STRIDE / 2 + MARGIN[0] + MARGIN[2]
}
function getFixedY(y) {
    return y * STRIDE + STRIDE / 2 + MARGIN[1] + MARGIN[3]
}

function reverseY(y) {
    return grid.h - 1 - y
    //return y
}

function mouseX2posX() {
    return (mouseX - STRIDE / 2 - MARGIN[0] - MARGIN[2]) / STRIDE
}
function mouseY2posY() {
    return grid.h - 1 - ((mouseY - STRIDE / 2 - MARGIN[1] - MARGIN[3]) / STRIDE)
}

function draw() {
    background(0, 0, 0)
    drawGrid()
    for (let chargedParticle of environment.charges) drawCharge(chargedParticle)
    drawCharge(new L.charge(mouseX2posX(), mouseY2posY(), NEW_CHARGE_TYPE), 0.4)
}

function drawCharge(chargedParticle, alpha=1) {
    strokeWeight(4)
    stroke(`rgba(255, 255, 255, ${alpha})`)
    let CHARGED_PARTICLE_WIDTH = STRIDE / 2
    let SIZE_OFFSET = (Math.log10(Math.abs(chargedParticle.Q)) + 9) * 3
    let SIGN_STROKE_WIDTH = (CHARGED_PARTICLE_WIDTH + SIZE_OFFSET) / 7
    let SIGN_HEIGHT = (CHARGED_PARTICLE_WIDTH + SIZE_OFFSET) * (3 / 4)
    switch (Math.sign(chargedParticle.Q)) {
        case 1:
            fill(`rgba(255, 0, 0, ${alpha})`)
            ellipse(getFixedX(chargedParticle.i), getFixedY(reverseY(chargedParticle.j)), CHARGED_PARTICLE_WIDTH + SIZE_OFFSET)
            stroke("rgba(0, 0, 0, 0)")
            fill(`rgba(255, 255, 255, ${alpha})`)
            rect(getFixedX(chargedParticle.i) - SIGN_STROKE_WIDTH / 2,
                getFixedY(reverseY(chargedParticle.j)) - SIGN_HEIGHT / 2,
                SIGN_STROKE_WIDTH, SIGN_HEIGHT)
            rect(getFixedX(chargedParticle.i) - SIGN_HEIGHT / 2,
                getFixedY(reverseY(chargedParticle.j)) - SIGN_STROKE_WIDTH / 2,
                SIGN_HEIGHT, SIGN_STROKE_WIDTH)
            break;
        case 0:
            fill(`rgba(34, 139, 34, ${alpha})`)
            ellipse(getFixedX(chargedParticle.i), getFixedY(reverseY(chargedParticle.j)), CHARGED_PARTICLE_WIDTH)
            break;
        case -1:
            fill(`rgba(0, 0, 255, ${alpha})`)
            ellipse(getFixedX(chargedParticle.i), getFixedY(reverseY(chargedParticle.j)), CHARGED_PARTICLE_WIDTH + SIZE_OFFSET)
            stroke("rgba(0, 0, 0, 0)")
            fill(`rgba(255, 255, 255, ${alpha})`)
            rect(getFixedX(chargedParticle.i) - SIGN_HEIGHT / 2,
                getFixedY(reverseY(chargedParticle.j)) - SIGN_STROKE_WIDTH / 2,
                SIGN_HEIGHT, SIGN_STROKE_WIDTH)
            break;
    }
}

function drawGrid() {
    stroke("rgba(0, 0, 0, 0)")
    let electricField = environment.electricField()
    for (let x = 0; x < grid.w; x++) {
        for (let y = 0; y < grid.h; y++) {
            let point = grid.point(x, y)
            let electricFieldVector = electricField.point(x, y)
            fill(`rgba(255, 255, 255, ${electricFieldVector.mag() / 100})`)
            ellipse(getFixedX(point.i), getFixedY(reverseY(point.j)), STRIDE / 6)
            rad = electricFieldVector.radwx()
            push()
            translate(getFixedX(point.i), getFixedY(reverseY(point.j)))
            rotate(-rad)
            rect(0, - STRIDE / 6 / 2, STRIDE / 2, STRIDE / 6)
            ARROW_WIDTH = STRIDE / 4
            ARROW_HEIGHT = ARROW_WIDTH
            triangle(STRIDE / 2, - STRIDE / 6 / 2 - ARROW_WIDTH / 2, STRIDE / 2, STRIDE / 6 / 2 + ARROW_WIDTH / 2, STRIDE / 2 + ARROW_HEIGHT, 0)
            pop()
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    STRIDE = stride.value
    let width = Math.floor((windowWidth - MARGIN[0] - MARGIN[2]) / STRIDE)
    let height = Math.floor((windowHeight - MARGIN[1] - MARGIN[3]) / STRIDE)
    grid.reshape(width, height)
}

function mousePressedC() {
    /*x = Math.round((mouseX - STRIDE / 2 - MARGIN[0] - MARGIN[2]) / STRIDE)
    y = Math.round((mouseY - STRIDE / 2 - MARGIN[1] - MARGIN[3]) / STRIDE)
    point = grid.point(x, y)
    point.charge += 1*/
    if (mouseButton === LEFT) {
        if (UNDO) {

        } else {
            environment.addCharge(new L.charge(mouseX2posX(), mouseY2posY(), NEW_CHARGE_TYPE))
        }
    }
}