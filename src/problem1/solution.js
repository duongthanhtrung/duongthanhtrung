// Implementation A - Using a simple loop
var sum_to_n_a = function(n) {
    // Validate positive integer input
    if (n <= 0) {
        throw new Error("Input must be a positive integer greater than 0");
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Implementation B - Using the arithmetic series formula
var sum_to_n_b = function(n) {
    // Validate positive integer input
    if (n <= 0) {
        throw new Error("Input must be a positive integer greater than 0");
    }

    return (n * (n + 1)) / 2;
};

// Implementation C - Using recursion
var sum_to_n_c = function(n) {
    // Validate positive integer input
    if (n <= 0) {
        throw new Error("Input must be a positive integer greater than 0");
    }

    if (n === 1) {
        return 1;
    }

    return n + sum_to_n_c(n - 1);
};
