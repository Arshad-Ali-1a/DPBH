chrome.commands.onCommand.addListener(function(command) {
  console.log("Command:", command)
  if (command === "getDOM") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
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

// chrome.commands.onCommand.addListener(function(command) {
//   console.log("Command:", command)
//   if (command === "searchResults") {
//       chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//           chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
//           console.log("Message sent");
//       });
//   }
// });