const URL = "https://teachablemachine.withgoogle.com/models/P6oh72qm9/";

let model, labelContainer, maxPredictions, uploadedImage;
let analyzeButton;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    uploadedImage = document.getElementById("uploaded-image");
    const imageUpload = document.getElementById("image-upload");
    analyzeButton = document.getElementById("analyze-button");

    analyzeButton.disabled = true; // Disable analyze button initially

    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage.src = e.target.result;
                uploadedImage.style.display = "block"; // Show the image
                analyzeButton.disabled = false; // Enable analyze button
                document.getElementById("result-container").innerHTML = ""; // Clear previous results
                labelContainer.innerHTML = ""; // Clear previous labels
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage.src = "#";
            uploadedImage.style.display = "none";
            analyzeButton.disabled = true;
            document.getElementById("result-container").innerHTML = "";
            labelContainer.innerHTML = "";
        }
    });

    analyzeButton.addEventListener("click", predict);

    // Call init to load the model when the script loads
    // No need for a separate "start" button anymore as image upload triggers analysis
}

async function predict() {
    if (uploadedImage.style.display === "none" || !uploadedImage.src || uploadedImage.src === "#") {
        alert("Please upload an image first.");
        return;
    }
    analyzeButton.disabled = true; // Disable button during prediction
    document.getElementById("result-container").innerHTML = "분석 중..."; // Show loading message
    console.log("Prediction started...");
    try {
        const prediction = await model.predict(uploadedImage);
        console.log("Prediction completed.");
        displayResult(prediction);
    } catch (error) {
        console.error("Prediction failed:", error);
        document.getElementById("result-container").innerHTML = "분석 중 오류 발생: " + error.message;
    }
    analyzeButton.disabled = false; // Re-enable button after prediction
}

function displayResult(prediction) {
    const dogMessages = [
        "당신은 사랑스러운 댕댕이상! 멍멍! 🐾",
        "복슬복슬 귀여운 강아지상이네요! 같이 산책 갈까요?",
        "사람을 잘 따르는 순둥순둥 강아지상! 🐶",
        "해맑은 미소가 매력적인 당신은 강아지상!",
        "꼬리 흔들며 반겨줄 것 같은 귀여운 강아지상입니다!"
    ];

    const catMessages = [
        "새침하고 도도한 매력의 고양이상! 야옹~ 😼",
        "무심한 듯 시크한 당신은 영락없는 고양이상이네요.",
        "알 수 없는 눈빛이 매력적인 당신은 고양이상!",
        "자꾸만 눈길이 가는 마성의 고양이상입니다. 🐈",
        "혼자만의 시간을 즐길 줄 아는 당신은 고양이상!"
    ];

    let highestProbability = 0;
    let result = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            result = prediction[i].className;
        }
    }

    const resultContainer = document.getElementById("result-container");
    if (result === "강아지 (Dog)") {
        const randomIndex = Math.floor(Math.random() * dogMessages.length);
        resultContainer.innerHTML = dogMessages[randomIndex];
    } else if (result === "고양이 (Cat)") {
        const randomIndex = Math.floor(Math.random() * catMessages.length);
        resultContainer.innerHTML = catMessages[randomIndex];
    }

    // Optional: display probabilities in the label container
    labelContainer.innerHTML = ""; // Clear previous labels
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;
    }
}

// Initialize the model when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);