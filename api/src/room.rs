use crate::message::Message;

#[allow(dead_code)]
pub struct Room {
    id: i32,
    messages: Vec<Message>,
}

impl Room {
    pub fn new(id: i32, messages: Vec<Message>) -> Self {
        Self { id, messages }
    }

    pub fn generate_prompt_for_ollama(&self) -> String {
        let mut prompt = String::new();
        let messages = &self.messages;

        for message in messages {
            prompt.push_str(&format!("{}: {}\n", message.role, message.content));
        }

        prompt.push_str("Assistant: ");

        prompt
    }
}