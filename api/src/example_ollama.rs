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
    messages: Vec<Message>,
}

impl Room {
    fn new(messages: Vec<Message>) -> Self {
        Self { messages }
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
//         Message::new(
//             "Assistant".to_string(),
//             r#"Hai! Pertanyaan yang bagus sekali. Langit terlihat biru karena fenomena alam yang disebut "penyebaran Rayleigh." Bayangkan cahaya matahari sebagai ombak-ombak kecil yang bergerak dengan kecepatan sangat tinggi menuju Bumi.

// Saat cahaya ini melewati udara, ia bertemu dengan molekul-molekul gas (terutama nitrogen dan oksigen). Molekul-molekul inilah yang "mengganggu" perjalanan cahaya tersebut. Gangguan ini lebih kuat terhadap warna biru dibandingkan warna merah, karena panjang gelombang biru lebih pendek – seperti mobil balap yang lebih cepat melewati rintangan.

// Akibatnya, sebagian besar cahaya biru tersebar (scatter) ke segala arah, dan mata kita melihatnya dari mana-mana. Sementara itu, warna merah dengan panjang gelombang yang lebih panjang, kurang terpengaruh oleh molekul udara, sehingga masih bisa mengarah langsung ke mata kita.

// Ketika Matahari berada di langit biru sebagian besar, cahaya birunya tersebar secara merata. Tapi saat Matahari mendekati horison (terbenam atau terbit), cahaya harus melewati udara yang lebih tebal, sehingga warna merahnya muncul lebih dominan – itulah mengapa langit bisa berwarna oranye atau merah pada saat senja dan subuh.

// Semoga penjelasan ini membantu! Apakah kamu ingin tahu tentang alasan perubahan warna langit saat terbit atau tenggelamnya matahari? Atau mungkin kamu tertarik dengan bagaimana warna yang kita lihat dipantulkan oleh atmosfer Bumi?"#.to_string(),
//         ),
//         Message::new(
//             "User".to_string(),
//             "Iya bagaimana alasan perubahan ketika matahari tenggelam ?".to_string(),
//         )
    ];

    let room = Room::new(messages);
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
