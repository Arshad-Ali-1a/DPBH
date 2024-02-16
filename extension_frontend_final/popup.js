console.log("popup.jsss loaded");

const home = document.getElementById('app-tab')
const load = document.getElementById('loaders-tab')
const results = document.getElementById('results-tab')
const botPage = document.getElementById('bots-tab')
const bot = document.getElementById('botBtn')
const loadText = document.getElementById('load-text')
let fetching = false

document.getElementById('scrapeBtn').addEventListener('click', scrape);
document.getElementById('botBtn').addEventListener('click', initBot);
document.getElementById('sendBtn').addEventListener('click', sendChat);

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
	if(request.action === "sendDOMForBot"){
		console.log("Received DOM for bot from background.js");
		const dom = request.result.data;
		const url = request.result.url;

		initVectorDb(dom,url);
	}
	if(request.action === "clearChat"){
		localStorage.setItem('chats', '');
	}
});

function initVectorDb(dom,url){
	console.log("got the dom");
	if(localStorage.getItem('lastVectorDb') === url){
		console.log("Taking previous vector db")
		startChat(url)
		
		return;
	}

	const blob = new Blob([dom], { type: 'text/html' });

    const formData = new FormData();
    formData.append('file', blob, 'dom_content.html');

    fetch('http://localhost:8001/initialize_vector_db/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
		startChat(url);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function startChat(url){
	localStorage.setItem('lastVectorDb', url);
	
	const chat = document.createElement('div');
	chat.classList.add('chat')

	chat.innerHTML = `
		<img src="./assets/chatbot.png" alt="">
		<p> Hello! I am the NOVA bot. How can I help you today? </p>
	`;

	document.getElementById('chats').appendChild(chat);

	load.style.display = "none"
	botPage.style.display = "flex"
	document.getElementById('app').style.width  = "700px"
	document.getElementById('app').style.height = "570px"
}

function sendChat(){
	const query = document.getElementById('chat-input').value;
	const url = localStorage.getItem('lastVectorDb');
	document.getElementById('sendBtn').disabled = true;
	
	document.getElementById('chat-input').value = "";

	if(query === "" || query.trim() === ""){
		const chat = document.createElement('div');
		chat.classList.add('chat')

		chat.innerHTML = `
			<img src="./assets/chatbot.png" alt="">
			<p> Please enter a valid query.</p>
		`;

		document.getElementById('chats').appendChild(chat);
		document.getElementById('sendBtn').disabled = false;
		var chats = document.getElementById('chats');
		chats.scrollTop = chats.scrollHeight;
		return;
	}

	createPersonChat(query, url);
}

function createPersonChat(query, url){
	const chat = document.createElement('div');
	chat.classList.add('chat')
	chat.innerHTML = `
		<img src="./assets/person.png" alt="">
		<p>${query}</p>
	`

	document.getElementById('chats').appendChild(chat);
	var chats = document.getElementById('chats');
    chats.scrollTop = chats.scrollHeight;
	createBotChat(query, url);
}

function createBotChat(query, url){

	const chat = document.createElement('div');
	chat.classList.add('chat')
	chat.innerHTML = `
		<img src="./assets/chatbot.png" alt="">
		<p id="loading">Thinking</p>
	`;

	document.getElementById('chats').appendChild(chat);
	document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight;

	fetch('http://localhost:8001/query_vector_db/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			input: query,
			url: url
		})
	})
	.then(response => response.json())
	.then(data => {
		const response = data['output'].trim();
		console.log("Query Response", response);

		var botChat = document.getElementById('loading')
		botChat.removeAttribute('id');
		botChat.setAttribute('id', 'typing-text')
		var chats = document.getElementById('chats');

		var index = 0;
		function type() {
			if (index < response.length) {
				var char = response.charAt(index);
				if (char === '\n') {
					char = '<br>';
				}
				botChat.innerHTML += char;
				index++;
				chats.scrollTop = chats.scrollHeight;
		
				setTimeout(type, 30);
			}
		}

		botChat.textContent = ''
		type();
		botChat.removeAttribute('id');
		document.getElementById('sendBtn').disabled = false;
	})
	.catch(error => {
		console.error('Error:', error);
		document.getElementById('sendBtn').disabled = false;
	});
}

function saveChats(){
	const chat = document.getElementById('chats').innerHTML;
	localStorage.setItem('chats', chat);
}

function scrape(){
	home.style.display = 'none'
	load.style.display = 'flex'
	bot.style.display = 'none'

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
	bot.style.display = 'block';
}

function highlight(result){
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTabId = tabs[0].id;
        chrome.runtime.sendMessage({ action: "highlightSentences", tabId: activeTabId, message: result });
        console.log("Message sent");
    });
	document.getElementById('successMsg').style.display = 'block';
}

function initBot(){

	// start loading
	home.style.display = "none"
	load.style.display = "flex"
	bot.style.display = "none"

	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: "domForBot" });
		console.log("Message sent");
		loadText.textContent = "Connecting to Servers"
		console.log("Scrapping started")
	});
}

// document.addEventListener("DOMContentLoaded", function () {
// 	// Establish a connection to the background script
// 	const port = chrome.extension.connect({ name: "popup" });
  
// 	// Notify the background script when the popup is closed
// 	window.addEventListener("beforeunload", function () {
// 		alert("Getting Closed")
// 	  port.postMessage("popupClosed");
// 	});
//   });
  