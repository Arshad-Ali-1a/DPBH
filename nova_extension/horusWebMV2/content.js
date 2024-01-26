console.log("sjdfnsjkdnfjksdnfkjsdnfjkdsf")
var jsonResult = {};

function calculateRelativePosition(element, windowSize) {
  const centerX = element.location.x + element.width / 2;
  const centerY = element.location.y + element.height / 2;

  // Determine the position based on the center coordinates
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

      // Process child nodes recursively
      var childNodes = Array.from(node.childNodes);
      childNodes.forEach(function (childNode) {
          collectLocationsById(childNode, collectedData);
      });
  }
}

function generateUniqueId() {
  return "id-" + Math.random().toString(36).substr(2, 9); // A simple method to generate unique IDs
}

function dfsExtractText(node, collectedLocations, windowSize) {
  console.log("dfs: ", windowSize)
  if (node.nodeType === Node.ELEMENT_NODE) {
      var nodeName = node.tagName ? node.tagName.toLowerCase() : null;

      // Process child nodes recursively
      var childNodes = Array.from(node.childNodes);
      childNodes.forEach(function (childNode) {
          dfsExtractText(childNode, collectedLocations, windowSize);
      });

      if (node.textContent.trim() === "") {
          return;
      }

      // Extract properties
      var textContent = node.textContent.trim();
      var id = node.id.trim() || "";
      var className = node.className.trim() || "";

      // Use the collected location data based on the element's ID
      var locationData = collectedLocations[id] || {};
      var x = locationData.location ? locationData.location.x : 0;
      var y = locationData.location ? locationData.location.y : 0;
      var height = locationData.height || 0;
      var width = locationData.width || 0;

      // Create an entry for the tag in the JSON format
      var tagEntry = {
          text: textContent,
          id: id,
          className: className,
          location: { x: x, y: y },
          height: height,
          width: width,
          position: calculateRelativePosition(locationData, windowSize)
      };

      // Add the entry to the corresponding tag array
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
  console.log("sdgnksjdngjfdngjkfdjgfndjgnfdgdfgjfdjkgfdjkgfdkgkggkjg")
  if (request.action === "getDOM") {
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
    console.log("sending",windowSize)
    dfsExtractText(bodyElementForLocation, collectedLocations, windowSize);
    console.log("dsfdsf", jsonResult)

    // images for visual analysis
    extractImages(bodyElementForLocation, collectedLocations, windowSize);
    
    chrome.runtime.sendMessage({ action: "sendDOM", result: {"url": window.location.href, "windowSize": windowSize, "data": jsonResult} });
    console.log("cleaning up")
    jsonResult = {};
  }
});

