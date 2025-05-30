use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use tokio::io::{self, AsyncWriteExt};
use tokio_stream::StreamExt;

pub async fn example_stream_ollama() -> Result<(), Box<dyn std::error::Error>> {
    let ollama = Ollama::default();
    let model: String = "aisingapore/Llama-SEA-LION-v3.5-8B-R:latest".to_string();
    let prompt: String = "Kenapa langit berwarna biru ?".to_string();

    let mut stream = ollama.generate_stream(GenerationRequest::new(model, prompt)).await.unwrap();

    let mut stdout = io::stdout();
    while let Some(res) = stream.next().await  {
        let responses = res.unwrap();
        for chunk in responses {
            stdout.write_all(chunk.response.as_bytes()).await.unwrap();
            stdout.flush().await.unwrap();
        }
    }

    Ok(())
}