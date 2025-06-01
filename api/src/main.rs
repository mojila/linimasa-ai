use std::{ptr::null, sync::Arc};
use axum::{body::Body, http::StatusCode, response::IntoResponse, routing::get, Router};
use sqlx::{postgres::PgPoolOptions, PgPool, Pool, Postgres};

mod example;
mod message;
mod room;

#[derive(Clone)]
struct AppState {
    db: Arc<PgPool>,
}


#[derive(serde::Serialize)]
struct Response<T> {
    status: String,
    message: String,
    version: String,
    data: T
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
        .route("/", get(get_welcome))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000").await.unwrap();

    println!("Listening on localhost:8000");

    axum::serve(listener, app).await.unwrap();
}

async fn get_welcome() -> impl IntoResponse {
    let wel: Response<Option<String>> = Response {
        status: "success".to_string(),
        message: "Welcome to the API".to_string(),
        version: "1.0.0".to_string(),
        data: None,
    };

    let json = serde_json::to_string(&wel).unwrap();

    axum::response::Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(Body::from(json))
        .unwrap()
}