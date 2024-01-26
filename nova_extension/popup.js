console.log("popup.js loaded");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "sendDOM") {
        const url = request.result.url;
        const data = request.result.data;
		const windowSize = request.result.windowSize;

        console.log("URL:", url);
		console.log("WINDOW SIZE:", windowSize);
        console.log("DATA:", JSON.stringify(data, null, 2));
	}
});

document.getElementById('getDOMButton').addEventListener('click', () => {
	console.log("Button clicked");
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
		console.log("Message sent");
	});
})