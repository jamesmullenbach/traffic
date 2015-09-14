// Simple way to attach js code to the canvas is by using a function

function sketchProc(p) {
    // Override draw function, by default it will be called 60 times   per second
    
    NUM_VEHICLES = 200;
    NUM_LANES = 4;
    CAR_WIDTH = 12;
    CAR_LENGTH = 20;
    TRUCK_WIDTH = 15;
    TRUCK_LENGTH = 50;
    PERCENT_TRUCKS = 25;
    LANE_WIDTH = Math.ceil(TRUCK_WIDTH * 1.2);
    AVG_THRESH = 50;
    THRESH_RANGE = 25;
    SPEED_LIMIT = 10;
    MIN_SPEED = 0;
    MIN_DISTANCE = 5;
    //have p.next = vehicle, p.behind = vehicle
    
    p.setup = function() {
        p.size(200,2600);
        START_X = 10;
        START_Y = p.height * 1 / 10;
        vehicles = [];
        for (var i = 0; i < NUM_VEHICLES; i++) {
            x_i = START_X + LANE_WIDTH * (i % NUM_LANES);
            thresh = AVG_THRESH + (THRESH_RANGE * Math.random()) - (THRESH_RANGE / 2);
            if ((i - NUM_LANES) >= 0) {
                ahead = vehicles[i - NUM_LANES];
                if (Math.random() > (PERCENT_TRUCKS / 100)) {
                    vehicles[i] = new vehicle(x_i, ahead.y + ahead.length + AVG_THRESH, 0, (SPEED_LIMIT - ((NUM_VEHICLES - i) / (NUM_VEHICLES / SPEED_LIMIT))), CAR_LENGTH, CAR_WIDTH, thresh);
                } else {
                    vehicles[i] = new vehicle(x_i, ahead.y + ahead.length + AVG_THRESH, 0, (SPEED_LIMIT - ((NUM_VEHICLES - i) / (NUM_VEHICLES / SPEED_LIMIT))), TRUCK_LENGTH, TRUCK_WIDTH, thresh);
                }
                vehicles[i].setAhead(ahead);
                vehicles[i].ahead.setBehind(vehicles[i]);
            } else {
                if (Math.random() > (PERCENT_TRUCKS / 100)) {
                    vehicles[i] = new vehicle(x_i, START_Y, 0, 1, CAR_LENGTH, CAR_WIDTH, thresh);
                } else {
                    vehicles[i] = new vehicle(x_i, START_Y, 0, 1, TRUCK_LENGTH, TRUCK_WIDTH, thresh);
                }
            }
        }
    };
      
    function vehicle(x, y, vx, vy, length, width, thresh) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.length = length;
        this.width = width;
        this.thresh = thresh;
        this.ahead = null;
        this.behind = null;
        this.changeThreshTimer = 0;
        this.setBehind = function(vBehind) {
            this.behind = vBehind;
        }
        this.setAhead = function(vAhead) {
            this.ahead = vAhead;
        }
        this.getAY = function() {
            //get y acceleration
            if (this.ahead == null) {
                return 0;
            } else {
                distance = this.y - (this.ahead.y + this.ahead.length);
                if (distance > this.thresh) {
                    //farther than threshold. accelerate if not already faster than ahead vehicle
                    if (this.vy > this.ahead.vy) {
                        return 0;
                    }
                    //accelerate more the greater the difference
                    return (distance - this.thresh) / 200;
                } else {
                    if (distance < MIN_DISTANCE) {
                        distance = MIN_DISTANCE;
                        this.y = this.ahead.y + this.ahead.length + 5;
                    }
                    //closer then threshold. decelerate if not already slower than ahead vehicle
                    if (this.vy < this.ahead.vy) {
                        return 0;
                    }
                    //decelerate more the greater the difference
                    return -3 / (Math.abs(distance)) + (1 / this.thresh);
                }
            }
        }
        this.getAX = function() {
            return 0;
        }
        this.resetThresh = function(distance, distanceBehind) {
            if (this.ahead != null && this.behind != null) {
                this.thresh = (distance + distanceBehind) / 2;
            }
        }
    }
    
    p.draw = function() {
        // erase background
        p.background(224);

        p.fill(255,0,0);
        for (var i = 0; i < vehicles.length; i++) {
            if (vehicles[i].ahead == null) {
                p.fill(0, 255, 0);
            } else if (vehicles[i].behind == null) {
                p.fill(0,0,0);
            } else {
                p.fill(255,0,0);
            }
            vehicles[i].vx += vehicles[i].getAX();
            vehicles[i].vy += vehicles[i].getAY();
            //enforce speed limit and min speed (no reverse)
            if (vehicles[i].vy > SPEED_LIMIT) {
                vehicles[i].vy = SPEED_LIMIT;
            } else if (vehicles[i].vy < MIN_SPEED) {
                vehicles[i].vy = MIN_SPEED;
            }
            vehicles[i].x -= vehicles[i].vx;
            vehicles[i].y -= vehicles[i].vy;
            p.rect(vehicles[i].x, vehicles[i].y, vehicles[i].width, vehicles[i].length);
        }
        
    };
  
}

var canvas = document.getElementById("canvas1");
// attaching the sketchProc function to the canvas
var p = new Processing(canvas, sketchProc);
// p.exit(); to detach it