mod example;

#[tokio::main]
async fn main() {
    example::ollama::example_stream_ollama().await.unwrap();
}