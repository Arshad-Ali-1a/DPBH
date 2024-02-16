chrome.commands.onCommand.addListener(function(command) {
  console.log("Command:", command)
  if (command === "getDOM") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
          console.log("Message sent");
      });
  }
  if (command === "domForBot") {
    console.log("domForBot command received")
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "domForBot" });
          console.log("Message sent");
      });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "highlightSentences") {
      console.log("background.js received message");
      const tabId = request.tabId;
      chrome.tabs.sendMessage(tabId, { action: "highlightSentences", sentence: request.message});
  }
});

function onPageOpened(details) {
  if (!details.frameId) {  // This condition ensures that the message is sent only for the main frame
    chrome.tabs.sendMessage(details.tabId, { action: "pageOpened" });
  }
}

chrome.webNavigation.onCompleted.addListener(onPageOpened);
