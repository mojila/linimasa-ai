use std::sync::Arc;
use axum::{body::Body, http::StatusCode, response::IntoResponse, routing::get, Json, Router};
use serde_json::Value;
use sqlx::{postgres::PgPoolOptions, PgPool, Pool, Postgres};

mod example;
mod message;
mod room;

#[derive(Clone)]
struct AppState {
    db: Arc<PgPool>,
}

impl AppState  {
    fn new(db: Arc<Pool<Postgres>>) -> Self {
        Self { db }
    }
}

#[tokio::main]
async fn main() {
    // load env
    dotenvy::dotenv().ok();

    // start database
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db = Arc::new(
        PgPoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await
            .expect("Failed to connect to database")
    );

    let app_state = AppState::new(db);

    // Build our application with a single route
    let app = Router::new()
        .route("/stream", get(get_welcome))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    println!("Listening on localhost:8000");

    axum::serve(listener, app).await.unwrap();
}

async fn get_welcome() -> impl IntoResponse {
    let json = serde_json::json!({ "message": "Welcome to linimasa.ai API v0" });

    axum::response::Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(Body::from(json.to_string()))
        .unwrap()
}