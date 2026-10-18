"use strict";

const recordBtn = document.getElementById("recordBtn");
const statusText = document.getElementById("statusText");
const transcript = document.getElementById("transcript");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const wordCount = document.getElementById("wordCount");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onstart = function () {
    isRecording = true;
    statusText.textContent = "Listening...";
    recordBtn.classList.add("recording");
  };

  recognition.onresult = function (event) {
    let finalText = "";
    let interimText = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalText += text + " ";
      } else {
        interimText += text;
      }
    }

    transcript.value += finalText + interimText;
    updateWordCount();
  };

  recognition.onerror = function (event) {
    console.log("Speech recognition error:", event.error);
    statusText.textContent = "Something went wrong";
  };

  recognition.onend = function () {
    if (isRecording) {
      recognition.start();
    }
  };
} else {
  statusText.textContent =
    "Speech recognition is not supported in this browser";
}

recordBtn.addEventListener("click", function () {
  if (!recognition) {
    return;
  }

  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

function startRecording() {
  transcript.focus();
  recognition.start();
}

function stopRecording() {
  isRecording = false;
  recognition.stop();

  statusText.textContent = "Ready to record";
  recordBtn.classList.remove("recording");
}

clearBtn.addEventListener("click", function () {
  transcript.value = "";
  updateWordCount();
});

transcript.addEventListener("input", updateWordCount);

function updateWordCount() {
  const text = transcript.value.trim();

  if (text === "") {
    wordCount.textContent = "0 words";
    return;
  }

  const words = text.split(/\s+/).length;

  wordCount.textContent =
    words === 1 ? "1 word" : `${words} words`;
}