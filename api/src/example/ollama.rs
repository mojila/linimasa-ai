use crate::message::Message;
use crate::room::Room;

use ollama_rs::{Ollama, generation::completion::request::GenerationRequest};
use tokio::io::{self, AsyncWriteExt};
use tokio_stream::StreamExt;

#[allow(dead_code)]
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
    let prompt = room.generate_prompt_for_ollama();
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
