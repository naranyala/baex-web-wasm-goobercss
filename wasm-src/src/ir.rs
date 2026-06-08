use serde::{Serialize, Deserialize};
use ts_rs::TS;

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum HLIR {
    UIUpdate { target_screen: String, state: String },
    SystemNotification { level: String, msg: String },
    ExternalLink { url: String, target: String },
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub enum LLIR {
    UpdateText { id: String, text: String },
    SetAttribute { id: String, attr: String, value: String },
    TriggerEvent { id: String, event: String },
    Log { message: String },
    Anomaly { code: String, details: String },
}

#[derive(Serialize, Deserialize, Debug, TS)]
#[ts(export)]
pub struct IRBundle {
    pub version: String,
    pub hlir: Option<HLIR>,
    pub llir: Vec<LLIR>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export)]
#[serde(tag = "type", content = "payload")]
pub enum IRCommand {
    Add { a: i32, b: i32 },
    Fibonacci { n: i32 },
    Factorial { n: i32 },
    ReverseString { text: String },
    PalindromeCheck { text: String },
    Greet { name: String },
    ReportAnomaly { message: String },
    RulesQuery,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, TS)]
#[ts(export)]
#[serde(tag = "type", content = "payload")]
pub enum IRResult {
    Number(i32),
    Void,
    Error { message: String },
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
