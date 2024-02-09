console.log("popup.jsss loaded");

const home = document.getElementById('app-tab')
const load = document.getElementById('loaders-tab')
const results = document.getElementById('results-tab')

const loadText = document.getElementById('load-text')
let fetching = false

document.getElementById('scrapeBtn').addEventListener('click', scrape);

// sending scrape request to background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "sendDOM") {
        const url = request.result.url;
        const data = request.result.data;
		const windowSize = request.result.windowSize;
		console.log("Received DOM from background.js");
		console.log(JSON.stringify(data, null, 2));
		fetchResults(data,url);
	}
});



function scrape(){
	home.style.display = 'none'
	load.style.display = 'flex'

	fetching = true;

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "getDOM" });
		console.log("Message sent");
		loadText.textContent = "Connecting to Servers"
		console.log("Scrapping started")
	});
}

function fetchResults(data,my_url){
	console.log("Connecting to api")
	console.log(data)
	console.log(my_url)
	loadText.textContent = "Analyzing Text Content"
	// const url = "https://api-dark-pattern.onrender.com/classify_texts";
	const url = "http://localhost:10000/classify_texts";
	fetch(url, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({"data":data,"my_url":new URL(my_url).hostname}),
	})
  .then((response) => response.json())
  .then((data) => {
	console.log("Results received")
	loadText.textContent = "Getting Results"
	
	updateUI(data);
  })
  .catch((error) => console.error('Error:', error));
}

function updateUI(data){
	const {result} = data;
	const {count} = data;
	console.log(Object.keys(data))

	console.log("Model...... " + JSON.stringify(data, null, 2));

	const container = document.getElementById('patterns-container');
	let total = 0;

	container.innerHTML = '';

	// Iterate over the count object and create new pattern divs
	for (const pattern in count) {
		const patternDiv = document.createElement('div');
		patternDiv.className = 'pattern';

		const patternName = document.createElement('p');
		patternName.className = 'pattern-name';
		patternName.textContent = pattern;

		const patternCount = document.createElement('p');
		patternCount.className = 'pattern-count';
		patternCount.textContent = count[pattern];

		total += count[pattern]

		patternDiv.appendChild(patternName);
		patternDiv.appendChild(patternCount);

		container.appendChild(patternDiv);
	}	

	const button = document.createElement('button');
	button.textContent = "Highlight Patterns";
	button.addEventListener('click', () => {
		highlight(result);
	});

	const successEL = document.createElement('p');
	successEL.textContent = "Dark Patterns are highlighted in red";
	successEL.style.display = 'none';
	successEL.style.position = 'absolute';
	successEL.style.bottom = "-18px";
	successEL.style.textAlign = 'center';
	successEL.style.color = '#ff0c00';
	successEL.style.left = "15px";
	successEL.id = 'successMsg';

	container.appendChild(button);
	container.appendChild(successEL);

	
	document.getElementById('total-patterns').textContent = total;
	
	load.style.display = 'none';
	results.style.display = 'flex';
}

function highlight(result){
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTabId = tabs[0].id;
        chrome.runtime.sendMessage({ action: "highlightSentences", tabId: activeTabId, message: result });
        console.log("Message sent");
    });
	document.getElementById('successMsg').style.display = 'block';
}