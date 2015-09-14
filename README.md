This is a project that uses processing.js to visualize traffic flow.

The acceleration of the vehicles is as follows:

Each vehicle has a unique "threshold" or "comfort zone", which defines the desired distance between that car and the car ahead of it. The acceleration of the car will be zero at that distance. When the car is closer to the car ahead of it than its comfort zone, its (negative) acceleration is proportional to the negative inverse of the distance - that is, the car will start hitting the brakes more and more as they get closer. When the car is farther from the comfort zone and not at the speed limit yet, their (positive) acceleration will be proportional to the difference between the distance and the threshold distance.

Cars are bounded in velocity on the bottom by 0 (stopped) and on the top by the set SPEED_LIMIT.
