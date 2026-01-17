const URL = "https://teachablemachine.withgoogle.com/models/P6oh72qm9/";
const SITE_URL = "https://product-builder-lecture-240.pages.dev/";

let model, labelContainer, maxPredictions, uploadedImage;
let analyzeButton;
let currentResult = ""; // 현재 결과 저장

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
    let resultMessage = "";

    if (result === "dog") {
        const randomIndex = Math.floor(Math.random() * dogMessages.length);
        resultMessage = dogMessages[randomIndex];
        currentResult = "강아지상";
    } else if (result === "cat") {
        const randomIndex = Math.floor(Math.random() * catMessages.length);
        resultMessage = catMessages[randomIndex];
        currentResult = "고양이상";
    }

    resultContainer.innerHTML = resultMessage;

    // Optional: display probabilities in the label container
    labelContainer.innerHTML = ""; // Clear previous labels
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;
    }

    // 공유 섹션 표시
    showShareSection();
}

// 공유 섹션 표시
function showShareSection() {
    const shareSection = document.getElementById("share-section");
    if (shareSection) {
        shareSection.style.display = "block";
    }
}

// 공유 텍스트 생성
function getShareText() {
    return `나는 ${currentResult}이래요! 🐾 AI 동물상 테스트로 당신의 동물상도 확인해보세요!`;
}

// 카카오톡 공유 (웹 공유 API 또는 URL 스킴)
function shareKakao() {
    const text = getShareText();
    const url = SITE_URL;

    // 카카오톡 공유 URL (모바일에서 작동)
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // 모바일: 카카오톡 URL 스킴
        const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(kakaoUrl, '_blank');
    } else {
        // PC: 카카오 스토리 공유
        const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(kakaoUrl, '_blank', 'width=600,height=400');
    }
}

// X(트위터) 공유
function shareTwitter() {
    const text = getShareText();
    const url = SITE_URL;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// 페이스북 공유
function shareFacebook() {
    const url = SITE_URL;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

// 링크 복사
async function copyLink() {
    const text = getShareText() + "\n" + SITE_URL;
    const messageEl = document.getElementById("share-message");

    try {
        await navigator.clipboard.writeText(text);
        messageEl.textContent = "링크가 복사되었습니다! 친구에게 공유해보세요 🎉";
        messageEl.classList.add("success");
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        messageEl.textContent = "링크가 복사되었습니다! 친구에게 공유해보세요 🎉";
        messageEl.classList.add("success");
    }

    // 3초 후 메시지 숨기기
    setTimeout(() => {
        messageEl.textContent = "";
        messageEl.classList.remove("success");
    }, 3000);
}

// 공유 버튼 이벤트 리스너 등록
function initShareButtons() {
    document.getElementById("share-kakao")?.addEventListener("click", shareKakao);
    document.getElementById("share-twitter")?.addEventListener("click", shareTwitter);
    document.getElementById("share-facebook")?.addEventListener("click", shareFacebook);
    document.getElementById("share-copy")?.addEventListener("click", copyLink);
}

// Initialize the model when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    initShareButtons();
});