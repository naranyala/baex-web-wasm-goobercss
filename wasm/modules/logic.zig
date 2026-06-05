export fn is_even(n: i32) i32 {
    return if (@mod(n, 2) == 0) 1 else 0;
}

export fn is_positive(n: i32) i32 {
    return if (n > 0) 1 else 0;
}

export fn _start() void {
    return;
}
