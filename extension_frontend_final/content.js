let url=window.location.href;
let searchUrl=url.substring(0, url.indexOf("search")+6);

function addToSearchResults() {
    let searchResults = document.querySelectorAll('div.g'); 
    searchResults.forEach((result, index) => {
        // Check if a span element already exists in the search result
        if (!result.querySelector('.dark-pattern-msg')) {
            let resultUrl = result.querySelector('a[href]');
            let searchUrltemp = new URL(resultUrl.href).hostname;
            console.log(result)
            const url = "http://localhost:10000/searchResults";
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "hostname": searchUrltemp }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Results received from database")
                let pattern;
                pattern = document.createElement('span');
                pattern.classList.add("dark-pattern-msg"); // Add a class for identification
                pattern.style.fontWeight = 'bold';
                pattern.style.marginRight = '5px';
                pattern.style.marginRight = "5px";
                pattern.style.fontSize = "16px";
                if (data["message"] != "No results found") {
                    pattern.textContent = data["pattern"].join(", ");
                    pattern.style.color = "red";
                } else {
                    // pattern.textContent = "No Dark Pattern Found";
                    // pattern.style.color = "green";
                    console.log("No dark pattern found in the database")
                }
                let spanElement = result.querySelector('.dark-pattern-msg');
                if (spanElement) {
                    result.removeChild(spanElement);
                }
                result.prepend(pattern)
            })
            .catch((error) => console.error('Error:', error));
        }
    });
}

if(searchUrl==="https://www.google.com/search"){
    console.log("this is a search url")
    addToSearchResults();
    
    window.addEventListener('scroll', () => {

     // threashold depending on browser mostly compatible
        const threshold = 1; 
        const isAtEndOfPage = window.innerHeight + window.scrollY + threshold >= document.documentElement.offsetHeight;
        if (isAtEndOfPage) {
            addToSearchResults();
            console.log("Reached the end of the page");
        }
    });
}
else{
    console.log("this is not a search url")
}

var jsonResult = {};

function calculateRelativePosition(element, windowSize) {
  const centerX = element.location.x + element.width / 2;
  const centerY = element.location.y + element.height / 2;

  // Determining the position based on the center coordinates
  if (centerX < windowSize.width / 3) {
      // Left third
      if (centerY < windowSize.height / 3) {
          return "top left";
      } else if (centerY < (2 * windowSize.height) / 3) {
          return "left center";
      } else {
          return "bottom left";
      }
  } else if (centerX < (2 * windowSize.width) / 3) {
      // Middle third
      if (centerY < windowSize.height / 3) {
          return "top center";
      } else if (centerY < (2 * windowSize.height) / 3) {
          return "center";
      } else {
          return "bottom center";
      }
  } else {
      // Right third
      if (centerY < windowSize.height / 3) {
          return "top right";
      } else if (centerY < (2 * windowSize.height) / 3) {
          return "right center";
      } else {
          return "bottom right";
      }
  }
}

function deleteSpecifiedTags(node) {
  var specifiedTags = ["head", "script", "noscript", "style", "br", "hr"];

  specifiedTags.forEach(function(tagName) {
      var elements = node.getElementsByTagName(tagName);
      for (var i = elements.length - 1; i >= 0; i--) {
          elements[i].parentNode.removeChild(elements[i]);
      }
  });
}

function collectLocationsById(node, collectedData) {
    // Comment Node
    // Element Node
    // Text Node

  if (node.nodeType === Node.ELEMENT_NODE) {
      var id = node.id.trim();
      if (id === "") {
          // Assign a unique ID if the element doesn't have one
          id = generateUniqueId();
          node.id = id;
      }

      var rect = node.getBoundingClientRect();
      collectedData[id] = {
          location: { x: rect.x, y: rect.y },
          height: rect.height,
          width: rect.width
      };

      // Processing child nodes recursively
      var childNodes = Array.from(node.childNodes);
      childNodes.forEach(function (childNode) {
          collectLocationsById(childNode, collectedData);
      });
  }
}

function generateUniqueId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

function dfsExtractText(node, collectedLocations, windowSize) {

  if (node.nodeType === Node.ELEMENT_NODE) {
    var nodeName = node.tagName ? node.tagName.toLowerCase() : null;

    // Processing child nodes recursively
    var childNodes = Array.from(node.childNodes);
    childNodes.forEach(function (childNode) {
        dfsExtractText(childNode, collectedLocations, windowSize);
    });

    // Extracting properties
    var textContent = Array.from(node.childNodes)
      .filter(child => child.nodeType === Node.TEXT_NODE)
      .map(child => child.textContent.trim())
      .join(' ');

    if (textContent === "") {
        return;
    }

    var id = node.id.trim() || "";
    var className = node.className.toString().trim() || ""; 

    // Using the collected location data based on the element's ID
    var locationData = collectedLocations[id] || {};
    var x = locationData.location ? locationData.location.x : 0;
    var y = locationData.location ? locationData.location.y : 0;
    var height = locationData.height || 0;
    var width = locationData.width || 0;

    // Creating an entry 
    var tagEntry = {
        text: textContent,
        id: id,
        className: className,
        location: { x: x, y: y },
        height: height,
        width: width,
        position: calculateRelativePosition(locationData, windowSize)
    };

    // Adding the entry to the corresponding tag array
    if (!jsonResult[nodeName]) {
        jsonResult[nodeName] = [];
    }
    jsonResult[nodeName].push(tagEntry);
  }
}

function extractImages(node, collectedLocations, windowSize) {
  var images = node.getElementsByTagName('img');
  jsonResult.img = [];

  for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (img.src.trim() === "") continue;

      var id = img.id.trim() || "";
      var className = img.className.trim() || "";

      // Use the collected location data based on the image's ID
      var locationData = collectedLocations[id] || {};
      var x = locationData.location ? locationData.location.x : 0;
      var y = locationData.location ? locationData.location.y : 0;
      var height = locationData.height || 0;
      var width = locationData.width || 0;

      var imageEntry = {
          src: img.src,
          location: { x: x, y: y },
          className: className,
          id: id,
          height: height,
          width: width,
          position: calculateRelativePosition(locationData, windowSize)
      };

      jsonResult.img.push(imageEntry);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.action)
  if (request.action === "getDOM") {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiii")
    var windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    let domForLocation = document.documentElement.cloneNode(true);

    // Collecting locations based on IDs
    var collectedLocations = {};
    collectLocationsById(domForLocation, collectedLocations);

    // deleting unnecessary tags
    deleteSpecifiedTags(domForLocation);
    // let bodyElementForLocation = document.body;
    let bodyElementForLocation = domForLocation.getElementsByTagName("body")[0];

    // extract contents via DFS
    dfsExtractText(bodyElementForLocation, collectedLocations, windowSize);

    // images for visual analysis
    extractImages(bodyElementForLocation, collectedLocations, windowSize);

    console.log(JSON.stringify(jsonResult, null, 2))
    chrome.runtime.sendMessage({ action: "sendDOM", result: {"url": window.location.href, "windowSize": windowSize, "data": jsonResult} });
    console.log("cleaning up")
    jsonResult = {};
  }

  if(request.action === "highlightSentences"){
    console.log(request.sentence)
    highlightText(document.body, request.sentence);

    const data = request.sentence;
    console.log(data);

    for (let key in data) {
        for (let sentence of data[key]) {
          highlightText(document.body, sentence, key)
      }
    }

    console.log("Higlighted all texts")
  }

  if(request.action === "domForBot"){
        const domContent = document.documentElement.outerHTML;
        chrome.runtime.sendMessage({ action: "sendDOMForBot", result: {"url": window.location.href, "data": domContent} });
    }

    if(request.action === "pageOpened"){
        console.log("Page opened")
        setTimeout( function () {

            const checkedInputs = document.querySelectorAll('input:checked');
            const checkedInputsValues = [];
        
            checkedInputs.forEach(input => {
              const inputValue = input.value || input.innerText || input.textContent;
              if (inputValue.trim() !== '') {
                checkedInputsValues.push(inputValue);
              }
            });
          
            console.log(checkedInputsValues.length)
            if (checkedInputsValues.length > 0) {
              createAlert(checkedInputsValues);
            }
          }, 500);     
    }
});

function createAlert(checkedInputsValues) {
    const html = `
    <div style="position: fixed; bottom: 50%; right: 67px; display: flex; flex-direction: column; justify-content: center; background-color: rgb(242, 242, 242); padding: 20px; border: 1px solid rgb(0, 0, 0); border-radius: 5px; width: 400px;">
      <div>
        <p style="font-size: 15px;">NOVAS has detected prechecked checkboxes</p>
      </div>
      <div id='inputs-container' style="display: flex; flex-direction: column; justify-content: center; margin-top: 10px;">
      </div>
    </div>
  `;
  
  const divElement = document.createElement('div');
  divElement.innerHTML = html;
  
  document.body.appendChild(divElement);
  console.log("Appended");

  setTimeout(function () {
    divElement.remove();
  }, 3000);
  
//   const textsContainer = document.getElementById('inputs-container');
//   console.log(textsContainer);
//   if (textsContainer) {
//     checkedInputsValues.forEach(value => {
//       const p = document.createElement('p');
//       p.textContent = '-> ' + value;
//       textsContainer.appendChild(p);
//     });
//   }
  
  
  }


function highlightText(node, searchText, patternType) {
  try {
      // Check if searchText is a valid regular expression
     let regex;
      try {
          regex = new RegExp(searchText);
      } catch (e) {
          console.error("error handled");
          return;
      }

      // NodeType = 3 => Text Node
      if(node.textContent === searchText && node.nodeType !== 3){
        node.style.border = "2px solid red";
        node.title = "Pattern Type: " + patternType;
        // transparent red background
        node.style.background = "rgba(255, 0, 0, 0.5)";
        node.style.zIndex = 10;
        return;
      }
      else if (node.nodeType === 3) {  // Text node
          if (node.nodeValue.includes(searchText)) {
              const parent = node.parentElement;
              parent.innerHTML = parent.innerHTML.replace(regex, `<span title="${"Pattern Type: " + patternType}" style="border:2px solid red;background-color:rgba(255, 0, 0, 0.5);z-index: 10">$&</span>`);
          }
      } else {
          for (const child of node.childNodes) {
              highlightText(child, searchText, patternType);
          }
      }
  } catch (error) {
      console.error('An error occurred:', error);
  }
}