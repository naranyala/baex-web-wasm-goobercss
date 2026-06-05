export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn subtract(a: i32, b: i32) i32 {
    return a - b;
}

export fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

export fn fibonacci(n: u32) i32 {
    if (n <= 1) return @intCast(n);
    var a: i32 = 0;
    var b: i32 = 1;
    for (0..n-1) |_| {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

export fn _start() void {
    return;
}
