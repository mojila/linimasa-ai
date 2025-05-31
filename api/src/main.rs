mod example;
mod message;
mod room;

#[tokio::main]
async fn main() {
    example::http_steam::chat_stream().await.expect("Failed to start server");
}
