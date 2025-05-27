chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkSpam") {
    console.log("Message received in background:", message.text);

    fetch("https://email-spam-detection-z0c3.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message.text })
    })
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data);
        //To send reult back to content.js
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "SPAM_RESULT",
          spam: data.spam
        });
      })
      .catch(err => {
        console.error("API error:", err);
      });
  }
});
