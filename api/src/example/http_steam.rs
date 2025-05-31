use std::convert::Infallible;

use axum::{body::{Body, Bytes}, response::IntoResponse, routing::get, Error, Router};
use ollama_rs::{generation::completion::request::GenerationRequest, Ollama};
use async_stream::stream;
use tokio_stream::StreamExt;

use crate::{message::Message, room::Room};

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
    let prompt = room.generate_prompt_for_ollama();
    let mut ollama_stream = ollama
        .generate_stream(GenerationRequest::new(model, prompt))
        .await
        .unwrap();

    let mut messages: Vec<String> = vec![];

    // Convert ollama_stream to an HTTP stream
    let body_stream = stream! {
        while let Some(res) = ollama_stream.next().await {
            match res {
                Ok(chunks) => {
                    for chunk in chunks {
                        messages.push(chunk.response.clone());

                        let data = format!("id: {}\nevent: thinking\ndata: {}\n\n", messages.len(), chunk.response);

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
        .header("Content-Type", "text/event-stream")
        .header("Cache-Control", "no-cache")
        .body(body)
        .unwrap()
}

#[allow(dead_code)]
pub async fn chat_stream() -> Result<(), Error> {
    // Build our application with a single route
    let app = Router::new().route("/stream", get(stream_handler));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    println!("Listening on localhost:8000");

    axum::serve(listener, app).await.unwrap();

    return Ok(());
}