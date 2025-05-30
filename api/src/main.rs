use std::convert::Infallible;

use async_stream::stream;
use axum::{
    Router,
    body::{Body, Bytes},
    response::IntoResponse,
    routing::get,
};
use example::ollama::{Message, Room};
use futures::FutureExt;
use ollama_rs::{Ollama, generation::completion::request::GenerationRequest};
use tokio_stream::StreamExt;

mod example;

#[tokio::main]
async fn main() {
    // Build our application with a single route
    let app = Router::new().route("/stream", get(stream_handler));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    println!("Listening on localhost:8000");

    axum::serve(listener, app).await.unwrap();
}

// Streaming handler
async fn stream_handler() -> impl IntoResponse {
    let ollama = Ollama::default();
    let model: String = "aisingapore/Llama-SEA-LION-v3.5-8B-R:latest".to_string();
    let messages = vec![
        Message::new(
            "System".to_string(),
            "Kamu adalah asisten ahli fisika bernama lini.".to_string(),
        ),
        Message::new("User".to_string(), "Hai siapa namamu ?".to_string()),
    ];

    let room = Room::new(1, messages);
    let prompt = room.generate_prompt();
    let mut ollama_stream = ollama
        .generate_stream(GenerationRequest::new(model, prompt))
        .await
        .unwrap();
    let mut message = String::new();

    // Convert ollama_stream to an HTTP stream
    let body_stream = stream! {
        while let Some(res) = ollama_stream.next().await {
            match res {
                Ok(chunks) => {
                    for chunk in chunks {
                        message.push_str(&chunk.response);

                        let payload = serde_json::json!({
                            "message": message,
                        });

                        let data = format!("{}\n", payload);

                        yield Ok::<Bytes, Infallible>(Bytes::from(data));
                    }
                }
                Err(_) => {
                    break;
                }
            }
        }
    };

    let body = Body::from_stream(body_stream);

    axum::response::Response::builder()
        .header("Content-Type", "application/json")
        .body(body)
        .unwrap()
}
