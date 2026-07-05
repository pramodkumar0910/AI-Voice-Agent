const micButton = document.getElementById("micButton");
const statusText = document.getElementById("status");
const chatBox = document.getElementById("chatBox");
function addMessage(sender, message) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {

        messageDiv.classList.add("user");

        messageDiv.innerHTML = `
            <strong>👤 You</strong>
            <p>${message}</p>
        `;

    } else {

        messageDiv.classList.add("ai");

        messageDiv.innerHTML = `
            <strong>🤖 AI</strong>
            <p>${message}</p>
        `;

    }

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

}

// Check browser support
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Speech Recognition is not supported in this browser.";
} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    micButton.addEventListener("click", () => {

        micButton.disabled = true;

micButton.classList.add("listening");

recognition.start();

statusText.innerText = "🎤 Listening...";
    });

    recognition.onresult = async (event) => {

        const transcript = event.results[0][0].transcript;

        addMessage("user", transcript);
        micButton.classList.remove("listening");

statusText.innerText = "🤖 Thinking...";
        // For now, show the same text
        try {

    const response = await fetch("https://pramodkumar.app.n8n.cloud/webhook/voice-agent", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            sessionId:"user1",
            message: transcript
        })

    });

    const data = await response.json();

    addMessage("ai", data.response);
    // Speak the AI response
    const speech = new SpeechSynthesisUtterance(data.response);
    speech.lang = "en-US";
    statusText.innerText = "🔊 Speaking...";

window.speechSynthesis.speak(speech);

speech.onend = () => {

    statusText.innerText = "✅ Ready";

    micButton.disabled = false;

};

} catch (error) {

    console.error(error);

    addMessage("ai", "❌ Sorry, something went wrong. Please try again.");

    micButton.classList.remove("listening");

    micButton.disabled = false;

    statusText.innerText = "❌ Error";

}

};   // <-- Ends recognition.onresult

recognition.onerror = (event) => {

    console.error(event.error);

    micButton.classList.remove("listening");

    micButton.disabled = false;

    statusText.innerText = "❌ Speech recognition failed";

};

recognition.onend = () => {

    micButton.classList.remove("listening");

    if (!window.speechSynthesis.speaking && !micButton.disabled) {
        statusText.innerText = "✅ Ready";
    }

};

}   // <-- Ends the 'else' block