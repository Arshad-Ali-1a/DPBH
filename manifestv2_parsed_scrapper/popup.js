console.log("popup.js loaded");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "sendDOM") {
        const url = request.result.url;
        const data = request.result.data;

        const parsedData = parseData(data);
        console.log("URL:", url);
        console.log("Parsed Data:", parsedData);
	}
});

// document.getElementById('getDOMButton').addEventListener('click', () => {})

document.addEventListener('keydown', function(event) {

	if (event.altKey && event.shiftKey && event.key === 'D') {
        console.log("Button clicked");
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
            console.log("Message sent");
        });
    }
});

function parseData(data) {
	var body = data.split('<body')[1].split('</body>')[0];
	body = body.substring(body.indexOf('>') + 1);

	var textElements = {};
	var elements = body.split('<');
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var tagName = element.split('>')[0];
		var text = element.split('>')[1];
		if (tagName && text) {
			if (textElements[tagName]) {
				textElements[tagName].push(text);
			} else {
				textElements[tagName] = [text];
			}
		}
	}

	return textElements;
}