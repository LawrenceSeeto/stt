const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcriptionDiv = document.getElementById('transcription');

let recognition;
let microphoneAccessGranted = false;

function initializeSpeechRecognition() {
    if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else {
        alert('Your browser does not support the Web Speech API. Please use a modern browser.');
        startBtn.disabled = true;
        stopBtn.disabled = true;
        return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function(event) {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                text += event.results[i][0].transcript + ' ';
            }
        }
        transcriptionDiv.textContent += text;
    };

    recognition.onerror = function(event) {
        console.error('Recognition error:', event.error);
    };

    recognition.onend = function() {
        console.log('Speech recognition has ended.');
    };
}

// Function to request microphone access
function requestMicrophoneAccess() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
            console.log('Microphone access granted.');
            microphoneAccessGranted = true;
            initializeSpeechRecognition();
        })
        .catch((err) => {
            console.error('Microphone access denied:', err);
            alert('Microphone access is required for this application. Please grant permission.');
            startBtn.disabled = true;
            stopBtn.disabled = true;
        });
}

// Request microphone access when the page loads
window.onload = requestMicrophoneAccess;

startBtn.addEventListener('click', () => {
    if (microphoneAccessGranted && recognition) {
        // Clear the transcription div if it contains any text
        transcriptionDiv.textContent = '';
        recognition.start();
        console.log('Speech recognition started.');
    }
});

stopBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
        console.log('Speech recognition stopped.');
    }
});
