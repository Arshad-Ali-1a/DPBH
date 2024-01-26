chrome.commands.onCommand.addListener(function(command) {
  if (command === "getDOM") {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
          console.log("Message sent");
      });
  }
});
