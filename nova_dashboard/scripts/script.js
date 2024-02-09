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
const itemsPerPage = 15;

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
    let base = 10;
    while (num >= base * 10) {
        base *= 10;
    }
    return base + '+';
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

    let classes = ['loader', 'home', 'stats', 'table-section']
    classes.forEach(element => {
        if(element != 'loader'){
            document.getElementsByClassName(element)[0].style.display = 'flex'
        }else{
            document.getElementsByClassName(element)[0].style.display = 'none'
        }
    })

    document.getElementById('dark-number').textContent = mapNumber(totalCount);
    document.getElementById('web-number').textContent = mapNumber(data.length);
    document.getElementById('type-number').textContent = mapNumber(patterns.size);

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

