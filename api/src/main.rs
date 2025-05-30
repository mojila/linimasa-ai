mod example_ollama;


#[tokio::main]
async fn main() {
    example_ollama::example_stream_ollama().await.unwrap();
}