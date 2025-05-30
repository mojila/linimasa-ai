use ollama_rs::{Ollama, generation::completion::request::GenerationRequest};
use tokio::io::{self, AsyncWriteExt};
use tokio_stream::StreamExt;

struct Message {
    role: String,
    content: String,
}

impl Message {
    fn new(role: String, content: String) -> Self {
        Self { role, content }
    }
}

struct Room {
    id: i32,
    messages: Vec<Message>,
}

impl Room {
    fn new(id: i32, messages: Vec<Message>) -> Self {
        Self { id, messages }
    }

    fn generate_prompt(&self) -> String {
        let mut prompt = String::new();
        let messages = &self.messages;

        for message in messages {
            prompt.push_str(&format!("{}: {}\n", message.role, message.content));
        }

        prompt.push_str("Assistant: ");

        prompt
    }
}

pub async fn example_stream_ollama() -> Result<(), Box<dyn std::error::Error>> {
    let ollama = Ollama::default();
    let model: String = "aisingapore/Llama-SEA-LION-v3.5-8B-R:latest".to_string();
    let messages = vec![
        Message::new(
            "System".to_string(),
            "Kamu adalah asisten ahli fisika bernama lini.".to_string(),
        ),
        Message::new(
            "User".to_string(),
            "Hai siapa namamu ?".to_string(),
        ),
    ];

    let room = Room::new(1, messages);
    let prompt = room.generate_prompt();
    let mut stream = ollama
        .generate_stream(GenerationRequest::new(model, prompt))
        .await
        .unwrap();
    let mut stdout = io::stdout();

    while let Some(res) = stream.next().await {
        let responses = res.unwrap();
        for chunk in responses {
            stdout.write_all(chunk.response.as_bytes()).await.unwrap();
            stdout.flush().await.unwrap();
        }
    }

    Ok(())
}
