let data = null;
const loadingTexts = [
    "Grabbing a cup of coffee for the server...",
    "Convincing the hamster to run faster...",
    "Summoning database gnomes...",
    "Counting to infinity twice...",
    "Making sure the bits are in the right order...",
    "Locating the lost electrons...",
    "Training the squirrels to fetch the data...",
    "Putting on a magic show for the loading bar...",
    "Asking the database politely to wake up...",
    "Performing a rain dance to speed up the process...",
];
let currentPage = 1;
const itemsPerPage = 8;

function getRandomLoadingText() {
    const randomIndex = Math.floor(Math.random() * loadingTexts.length);
    return loadingTexts[randomIndex];
}

document.getElementById('loader-text').textContent = getRandomLoadingText();

function fetchData(){
    fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData;
        console.log(fetchedData);
        main()
    })
    .catch(error => console.error('Error:', error));
}

fetchData();

function mapNumber(num) {
    let base = 0;
    if(num < 10){
        base = Math.ceil(num / 1) * 1;
    }
    else if(num < 100){
        base = Math.ceil(num / 10) * 10;
    }
    else if (num < 1000) {
        base = Math.ceil(num / 100) * 100;
    } else if (num < 10000) {
        base = Math.ceil(num / 500) * 500;
    } else {
        base = Math.ceil(num / 10000) * 10000;
    }

    if (num === base) {
        return base.toString();
    } else {
        return base.toString() + '+';
    }
}




function changePage(offset) {
    currentPage += offset;
    if (currentPage < 1) {
        currentPage = 1;
    }
    renderTable();
}

function renderTable() {
    var tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    document.getElementById('searchInput').addEventListener('keyup', filterTable);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    currentData.forEach(function (item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.textContent = item.domain_name;
        cell2.textContent = item.count;
        cell3.textContent = item.pattern.join(', ');
    });
}

function filterTable() {
    var input = document.getElementById('searchInput');
    var filter = input.value.toUpperCase();
    var rows = document.getElementById('darkPatternsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
        var domainName = rows[i].getElementsByTagName('td')[0].textContent || rows[i].getElementsByTagName('td')[0].innerText;

        if (domainName.toUpperCase().indexOf(filter) > -1) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById('darkPatternsTable');
    switching = true;

    while (switching) {
        switching = false;
        rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[columnIndex];
            y = rows[i + 1].getElementsByTagName('td')[columnIndex];

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function main(){

    let labels = []
    let values = []
    let totalCount = 0;
    let patterns = new Set();
    let patternMap = new Map();

    let pieKeys = null;
    let pieValues = null;
    

    data.sort((a, b) => b.count - a.count); // Sort data in descending order based on count
    console.log(data);

    let limit = 0;

    for(let i = 0; i < data.length; i++){
        if(limit == 25){
            break;
        }
        limit++;
        labels.push(data[i].domain_name)
        values.push(data[i].count)
        patterns.add(data[i].pattern)
        totalCount += data[i].count

        data[i].pattern.forEach(pattern => {
            if(patternMap.has(pattern)){
                patternMap.set(pattern, patternMap.get(pattern) + 1)
            }else{
                patternMap.set(pattern, 1)
            }
        })
    }

    pieKeys = Array.from(patternMap.keys());
    pieValues = Array.from(patternMap.values());

    let classes = ['loader', 'home', 'stats', 'table-section', 'chatbot-icon']
    classes.forEach(element => {
        if(element != 'loader'){
            document.getElementsByClassName(element)[0].style.display = 'flex'
        }else{
            document.getElementsByClassName(element)[0].style.display = 'none'
        }
    })

    document.getElementById('botBtn').addEventListener('click', renderChat);
    document.getElementById('sendBtn').addEventListener('click', sendChat);
    document.getElementById('dark-number').textContent = mapNumber(totalCount);
    document.getElementById('web-number').textContent = mapNumber(data.length);
    document.getElementById('type-number').textContent = mapNumber(patternMap.size);
    console.log(patternMap)
    console.log("Total Patterns", totalCount)
    var ctx = document.getElementById('barGraph').getContext('2d');
    var barGraph = new Chart(ctx, {
        type: 'bar', // Change this to 'bar' for a histogram
        data: {
            labels: labels,
            datasets: [{
                label: '# of Dark Patterns',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    
    var piectx = document.getElementById('pieChart').getContext('2d');
    var myPieChart = new Chart(piectx, {
        type: 'pie',
        data: {
            labels: pieKeys,
            datasets: [{
                data: pieValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });



    renderTable()
    AOS.init();
    
}

function renderChat(){
    const botTab = document.getElementById('bots-tab');

    if(botTab.style.display === 'none'){
        botTab.style.display = 'flex';
        console.log(document.getElementById('chats').innerHTML.trim() === "")
        if(document.getElementById('chats').innerHTML.trim() === ""){

            const chat = document.createElement('div');
            chat.classList.add('chat')

            chat.innerHTML = `
                <img src="../assets/chatbot.png" alt="">
                <p> Hello I'm the NOVA Bot, Here to help you understand about dark patterns. feel free to ask me anything.</p>
            `;

            document.getElementById('chats').appendChild(chat);
            document.getElementById('sendBtn').disabled = false;
            var chats = document.getElementById('chats');
            chats.scrollTop = chats.scrollHeight;
        }
    }
    else{
        botTab.style.display = 'none';
    }
}

function sendChat(){

    const query = document.getElementById('chat-input').value;
	document.getElementById('sendBtn').disabled = true;
	document.getElementById('chat-input').value = "";

	if(query === "" || query.trim() === ""){
		const chat = document.createElement('div');
		chat.classList.add('chat')

		chat.innerHTML = `
			<img src="../assets/chatbot.png" alt="">
			<p> Please enter a valid query.</p>
		`;

		document.getElementById('chats').appendChild(chat);
		document.getElementById('sendBtn').disabled = false;
		var chats = document.getElementById('chats');
		chats.scrollTop = chats.scrollHeight;
		return;
	}

	createPersonChat(query);
}

function createPersonChat(query){
	const chat = document.createElement('div');
	chat.classList.add('chat')
	chat.innerHTML = `
		<img src="../assets/person.png" alt="">
		<p>${query}</p>
	`

	document.getElementById('chats').appendChild(chat);
	var chats = document.getElementById('chats');
    chats.scrollTop = chats.scrollHeight;
	createBotChat(query);
}

function createBotChat(query){

	const chat = document.createElement('div');
	chat.classList.add('chat')
	chat.innerHTML = `
		<img src="../assets/chatbot.png" alt="">
		<p id="loading">Thinking</p>
	`;

	document.getElementById('chats').appendChild(chat);
	document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight;

	//! after getting response use the following

    fetch('http://localhost:8001/anti_darkness_query/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			input: query,
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

document.addEventListener('mousedown', function(event) {
    var botsTab = document.getElementById('bots-tab');
    var isClickInsideElement = botsTab.contains(event.target);

    if (!isClickInsideElement && botsTab.style.display !== 'none') {
        // The user clicked outside the element, handle it here
        botsTab.style.display = 'none';
    }
});