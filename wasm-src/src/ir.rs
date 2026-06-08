use serde::{Serialize, Deserialize};
use ts_rs::TS;

/// High-Level Intermediate Representation (HLIR).
/// Represents conceptual UI operations that the framework should execute.
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum HLIR {
    /// Updates a specific screen's state.
    UIUpdate { target_screen: String, state: String },
    /// Displays a system-level notification.
    SystemNotification { level: String, msg: String },
    /// Requests the application to navigate to an external URL.
    ExternalLink { url: String, target: String },
}

/// Low-Level Intermediate Representation (LLIR).
/// Represents atomic DOM mutations or system calls.
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum LLIR {
    /// Updates the text content of a DOM element.
    UpdateText { id: String, text: String },
    /// Sets a specific attribute on a DOM element.
    SetAttribute { id: String, attr: String, value: String },
    /// Triggers a specific JS event on a DOM element.
    TriggerEvent { id: String, event: String },
    /// Logs a message to the browser console.
    Log { message: String },
    /// Reports an anomaly detected during processing.
    Anomaly { code: String, details: String },
}

/// A package of IR instructions resulting from a single action.
#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct IRBundle {
    /// The version of the IR schema used.
    pub version: String,
    /// Optional high-level conceptual update.
    pub hlir: Option<HLIR>,
    /// A sequence of low-level atomic instructions.
    pub llir: Vec<LLIR>,
}

/// Commands sent from the TS Bridge to the Rust core.
#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export)]
#[serde(tag = "type", content = "payload")]
pub enum IRCommand {
    /// Adds two integers.
    Add { a: i32, b: i32 },
    /// Calculates Nth Fibonacci number.
    Fibonacci { n: i32 },
    /// Calculates factorial of N.
    Factorial { n: i32 },
    /// Reverses a given string.
    ReverseString { text: String },
    /// Checks if a string is a palindrome.
    PalindromeCheck { text: String },
    /// Generates a greeting for a user.
    Greet { name: String },
    /// Manually reports an anomaly from the frontend.
    ReportAnomaly { message: String },
    /// Queries the current IR rules schema.
    RulesQuery,
}

/// Results returned from the Rust core to the TS Bridge.
#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export)]
#[serde(tag = "type", content = "payload")]
pub enum IRResult {
    /// A numerical result.
    Number(i32),
    /// An operation that returns nothing.
    Void,
    /// An error result with a message.
    Error { message: String },
    /// A schema or set of rules.
    Rules { schema: String },
}

#[cfg(test)]
mod ts_tests {
    use super::*;
    #[test]
    fn generate_types() {
        let config = Config::default();
        HLIR::export(&config).unwrap();
        LLIR::export(&config).unwrap();
        IRBundle::export(&config).unwrap();
        IRCommand::export(&config).unwrap();
        IRResult::export(&config).unwrap();
    }
}
