export fn square(n: i32) i32 {
    return n * n;
}

export fn cube(n: i32) i32 {
    return n * n * n;
}

export fn absolute(n: i32) i32 {
    return if (n < 0) -n else n;
}

export fn _start() void {
    return;
}
