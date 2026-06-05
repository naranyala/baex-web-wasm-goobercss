// These functions are provided by the JS HostAPI
extern "env" fn browser_log(ptr: [*]const u8, len: usize) void;
extern "env" fn browser_alert(ptr: [*]const u8, len: usize) void;
extern "env" fn browser_set_title(ptr: [*]const u8, len: usize) void;

pub fn log_hello() void {
    const msg = "Hello from Zig via Browser API Extension!";
    browser_log(msg.ptr, msg.len);
}

pub fn trigger_alert() void {
    const msg = "🚨 Alert triggered from Zig!";
    browser_alert(msg.ptr, msg.len);
}

pub fn update_page_title() void {
    const msg = "Zig WASM Browser Ext";
    browser_set_title(msg.ptr, msg.len);
}

export fn _start() void {
    return;
}
