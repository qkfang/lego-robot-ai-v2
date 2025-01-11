toggleButton = document.getElementById('toggleButton');
callButton = document.getElementById('callButton');
statusMessage = document.getElementById('statusMessage');
reportDiv = document.getElementById('report');
isRecording = false;
websocket = null;
audioContext = null;
mediaStream = null;
mediaProcessor = null;
audioQueueTime = 0;
// backendHost = "localhost:8765";
// backendHost = `${window.location.host}`;
backendHost = `legoaibot-prd-api-rt.bluestone-0d32ea35.eastus.azurecontainerapps.io`;
// https://legoaibot-prd-api-rt.bluestone-0d32ea35.eastus.azurecontainerapps.io/

//  websocket = new WebSocket('ws://localhost:8765/realtime') 

// Variables for client-side VAD (optional)
speaking = false;
VAD_THRESHOLD = 0.01; // Adjust this threshold as needed

async function startRecording() {
    isRecording = true;
    toggleButton.textContent = 'Stop Conversation';
    statusMessage.textContent = 'Recording...';

    // Initialize AudioContext if not already done
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        audioQueueTime = audioContext.currentTime;
    }

    // Open WebSocket connection
    wsUrl = `wss://${backendHost}/realtime`;
    console.log(wsUrl);
    // if (window.location.protocol != "https:") {
        websocket = new WebSocket(wsUrl);
    // }else
    // {
    //     websocket = new WebSocket(`wss://${backendHost}/realtime`);
    // }    

    websocket.onopen = () => {
        console.log('WebSocket connection opened');
        // Send session update with all required parameters
        const sessionUpdate = {
            type: 'session.update',
            session: {
                turn_detection: {
                    type: 'server_vad',
                    threshold: 0.7,          // Adjust if necessary
                    prefix_padding_ms: 300,  // Adjust if necessary
                    silence_duration_ms: 500 // Adjust as needed
                },
                // If you want to enable input audio transcription
                // input_audio_transcription: {
                //     model: 'whisper-1'
                // }
                // Do not include 'tools' and 'tool_choice'; backend will handle them
                // Other parameters like 'temperature' and 'max_response_output_tokens' can be set here if needed
            }
        };
        websocket.send(JSON.stringify(sessionUpdate));
    };

    websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        handleWebSocketMessage(message);
    };

    websocket.onclose = () => {
        console.log('WebSocket connection closed');
        if (isRecording) {
            stopRecording();
        }
    };

    websocket.onerror = (event) => {
        console.error('WebSocket error:', event);
    };

    // Start recording audio
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(mediaStream);

    mediaProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(mediaProcessor);
    mediaProcessor.connect(audioContext.destination);

    mediaProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32Array to Int16Array
        const int16Data = float32ToInt16(inputData);
        // Convert to Base64
        const base64Audio = int16ToBase64(int16Data);
        // Send audio data to server
        const audioCommand = {
            type: 'input_audio_buffer.append',
            audio: base64Audio
        };
        websocket.send(JSON.stringify(audioCommand));

        // Optional: Client-side VAD for immediate interruption handling
        const isUserSpeaking = detectSpeech(inputData);
        if (isUserSpeaking && !speaking) {
            speaking = true;
            console.log('User started speaking');
            // Stop assistant's audio playback
            stopAssistantAudio();
        } else if (!isUserSpeaking && speaking) {
            speaking = false;
            console.log('User stopped speaking');
        }
    };
}

function stopRecording() {
    isRecording = false;
    toggleButton.textContent = 'Start Conversation';
    statusMessage.textContent = 'Stopped';

    if (mediaProcessor) {
        mediaProcessor.disconnect();
        mediaProcessor.onaudioprocess = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    if (websocket) {
        websocket.close();
        websocket = null;
    }
}

function onToggleListening() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function onCallButton() {
    const phonenumber = document.getElementById('phonenumber').value;

    const callDetails = {
        target_number: phonenumber
    };

    fetch('/call', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callDetails)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        statusMessage.textContent = data
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = "Failed to create call"
    });
}

function handleWebSocketMessage(message) {
    switch (message.type) {
        case 'response.audio.delta':
            // Play audio delta
            if (message.delta) {
                playAudio(message.delta);
            }
            break;
        case 'response.done':
            // Conversation response is complete
            console.log('Response done');
            break;
        case 'extension.middle_tier_tool_response':
            // Handle tool response
            if (message.tool_name === 'generate_game') {
                const report = JSON.parse(message.tool_result);
                displayReport(report);
            }
            // if (message.tool_name === 'game_game') {
            //     const report = JSON.parse(message.tool_result);
            //     displayReport(report);
            // }
            break;
        case 'error':
            console.error('Error message from server:', JSON.stringify(message, null, 2));
            break;
        default:
            console.log('Unhandled message type:', message.type);
    }
}

assistantAudioSources = [];

function playAudio(base64Audio) {
    const binary = atob(base64Audio);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);

    // Convert Int16Array to Float32Array
    const float32Array = int16ToFloat32(int16Array);

    // Create an AudioBuffer and play it
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        audioQueueTime = audioContext.currentTime;
    }

    const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.copyToChannel(float32Array, 0);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    // Schedule the audio chunk to play at the correct time
    const currentTime = audioContext.currentTime;
    const startTime = Math.max(audioQueueTime, currentTime + 0.1); // Slight delay to prevent overlap
    source.start(startTime);

    // Keep track of audio sources
    assistantAudioSources.push(source);

    // Update the audioQueueTime to the end of this buffer
    audioQueueTime = startTime + audioBuffer.duration;

    source.onended = () => {
        // Remove source from array when it finishes playing
        assistantAudioSources = assistantAudioSources.filter(s => s !== source);
    };
}

function stopAssistantAudio() {
    // Stop all assistant audio sources
    assistantAudioSources.forEach(source => {
        try {
            source.stop();
        } catch (e) {
            console.error('Error stopping audio source:', e);
        }
    });
    assistantAudioSources = [];
    audioQueueTime = audioContext.currentTime;
}

function displayReport(report) {
    reportDiv.textContent = JSON.stringify(report, null, 2);
}

function float32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
}

function int16ToBase64(int16Array) {
    const byteArray = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        binary += String.fromCharCode(byteArray[i]);
    }
    return btoa(binary);
}

function int16ToFloat32(int16Array) {
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        let int = int16Array[i];
        // Convert back to float
        let float = int < 0 ? int / 0x8000 : int / 0x7FFF;
        float32Array[i] = float;
    }
    return float32Array;
}

function detectSpeech(inputData) {
    // Calculate the root mean square (RMS) of the inputData
    let sumSquares = 0;
    for (let i = 0; i < inputData.length; i++) {
        sumSquares += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sumSquares / inputData.length);
    return rms > VAD_THRESHOLD;
}

function load() {
    
    toggleButton = document.getElementById('toggleButton');
    statusMessage = document.getElementById('statusMessage');
    reportDiv = document.getElementById('report');
    
    toggleButton.addEventListener('click', onToggleListening);

    fetch(`https://${backendHost}/status`)
        .then(response => response.text())
        .then(data => 
            {
                json_data = JSON.parse(data)
                if (json_data.outbound_calling_enabled){
                    phonenumber.disabled = false;
                }
                // statusMessage.textContent = json_data.status;
                console.log(json_data);
            }
        )
        .catch(error => console.error('Error:', error));
};

load();