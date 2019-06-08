L = (function () {
    kilo = v => v * Math.pow(10, 3)
    centi = v => v * Math.pow(10, -2)
    milli = v => v * Math.pow(10, -3)
    micro = v => v * Math.pow(10, -6)
    nano = v => v * Math.pow(10, -9)
    class vector {
        constructor(i=0, j=0) {
            this.i = i
            this.j = j
        }
        radwx() {
            let rad = vector.rad(this, new vector(1, 0))
            if (Math.sign(this.j) === -1) rad = 2 * Math.PI - rad
            return rad
        }
        mag() {
            return Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2))
        }
        static dist(v1, v2) {
            return Math.sqrt(Math.pow(v2.i - v1.i, 2) + Math.pow(v2.j - v1.j, 2))
        }
        static add(values) {
            let s = new vector(0, 0)
            for (let v of values) {
                s.i += v.i
                s.j += v.j
            }
            return s
        }
        static sub(v1, v2) {
            return new vector(v1.i - v2.i, v1.j - v2.j)
        }
        static cmul(c, v) {
            return new vector(c * v.i, c * v.j)
        }
        static dot(v1, v2) {
            return v1.i * v2.i + v1.j * v2.j
        }
        static rad(v1, v2) {
            return Math.acos(vector.dot(v1, v2) / (v1.mag() * v2.mag()))
        }
    }
    class charge extends vector {
        constructor(x, y, Q=0) {
            super(x, y)
            this.Q = Q
        }
        electricField(d, k) {
            if (d == 0) return null
            return (k * this.Q) / Math.pow(d, 2)
        }
    }
    class grid {
        constructor(w, h) {
            this.w = w
            this.h = h
            this.points = []
            for (let x = 0; x < w; x++) {
                this.points.push([])
                for (let y = 0; y < h; y++) {
                    this.points[x].push(new vector(x, h - y - 1))
                }
            }
        }
        point(x, y) {
            return this.points[x][y]
        }
        setPoint(x, y, point) {
            this.points[x][y] = point
        }
        reshape(w, h) {
            this.points = []
            for (let x = 0; x < w; x++) {
                this.points.push([])
                for (let y = 0; y < h; y++) {
                    this.points[x].push(new vector(x, h - y - 1))
                }
            }
            this.w = w
            this.h = h
        }
        static emptyLike(og) {
            return new grid(og.w, og.h)
        }
    }
    K = {
        Air: 9e+9
    }
    class field {
        constructor(grid, k, charges=[]) {
            this.grid = grid
            this.k = k
            this.charges = charges
        }
        addCharge(charge) {
            this.charges.push(charge)
        }
        electricField() {
            let electricFieldGrid = grid.emptyLike(this.grid)
            for (let x = 0; x < electricFieldGrid.w; x++) {
                for (let y = 0; y < electricFieldGrid.h; y++) {
                    let refvec = this.grid.point(x, y)
                    let get_force = p => {
                        let dx = p.i - refvec.i, dy = p.j - refvec.j
                        let dx_s = Math.pow(dx, 2)
                        let dy_s = Math.pow(dy, 2)
                        let electricFieldMagnitude = p.electricField(Math.sqrt(dx_s + dy_s), this.k)
                        if (electricFieldMagnitude === null) return null;
                        electricFieldMagnitude *= -1
                        let dir = vector.sub(p, refvec)
                        let electricField = vector.cmul(electricFieldMagnitude / dir.mag(), dir)
                        return electricField
                    }
                    let forces = this.charges.map(get_force)
                    if (forces.some(v => v === null)) {
                        electricFieldGrid.point(x, y).i = null
                        electricFieldGrid.point(x, y).j = null
                    }
                    electricFieldGrid.setPoint(x, y, vector.add(forces))
                }
            }
            return electricFieldGrid
        }
    }
    return {kilo, centi, milli, micro, nano, vector, charge, grid, K, field}
})()