//Extracts email body and sends it to background.js
function getEmailBodyAndCheckSpam() {
  const emailElement = document.querySelector("div.a3s.aiL");
  if (emailElement) {
    const emailText = emailElement.innerText;
    console.log("Email content:", emailText);
    chrome.runtime.sendMessage({ action: "checkSpam", text: emailText });
  } else {
    console.warn("Email body not found");
  }
}

function insertSpamBanner(isSpam) {
  // Prevent duplicate banners
  if (document.getElementById("spam-banner")) return;
  //Adds a banner indicating spam status
  const banner = document.createElement("div");
  banner.id = "spam-banner";
  banner.textContent = isSpam
    ? "⚠️ This email appears to be spam. Be cautious."
    : "✅ This email looks safe.";

  banner.style.cssText = `
    background-color: ${isSpam ? "#ffcccc" : "#ccffcc"};
    padding: 10px;
    font-weight: bold;
    border: 1px solid ${isSpam ? "red" : "green"};
    margin: 10px;
    text-align: center;
    border-radius: 5px;
  `;

  const target = document.querySelector("div.a3s.aiL");
  if (target) {
    target.parentNode.insertBefore(banner, target);
  }
}

// Listen for response from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SPAM_RESULT") {
    console.log("Spam result received:", message.spam);
    insertSpamBanner(message.spam);
  }
});

// Observe whenever gmail is opened
const observer = new MutationObserver(() => {
  const emailContent = document.querySelector("div.a3s.aiL");
  if (emailContent && !document.getElementById("spam-banner")) {
    console.log("Email detected, checking for spam...");
    getEmailBodyAndCheckSpam();
  }
});
//Attaches observer after windoe is loads
window.addEventListener("load", () => {
  const targetNode = document.body;
  if (targetNode) {
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
    console.log("MutationObserver attached for email content.");
  }
});
