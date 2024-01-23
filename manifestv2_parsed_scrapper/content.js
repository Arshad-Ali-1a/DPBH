chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request);
  
  if (request.action === "getDOM") {

      var domContent = document.documentElement.outerHTML;


      var tabUrl = window.location.href;

      var result = {
          url: tabUrl,
          data: domContent
      };

      chrome.runtime.sendMessage({ action: "sendDOM", result: result });
  }
});
