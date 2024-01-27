# System Architecture

Here's the working of our **Chrome Extension** and **Mobile Application**

![Architecture](../images/architecture.png)

## Extension Architecture Overview:

The Chrome extension for detecting dark patterns comprises a popup interface that users interact with by clicking on the extension icon. This interface triggers a detection process, communicating with a background script, which, in turn, signals a content script to initiate data extraction from the active webpage.

The content script, injected into the webpage, gathers information about HTML elements such as tags, text, id, class, location, height, and width. This data is structured in JSON format and transmitted to a cloud-hosted server for dark pattern detection, leveraging machine learning models.

The server processes the received JSON data, utilizing its dark pattern detection model to identify patterns within the webpage. The results, including the type and count of detected dark patterns, along with specific text elements identified, are sent back to the content script.

Upon receiving the server's response, the content script highlights the identified dark pattern elements on the webpage. Simultaneously, it communicates with the popup to relay the detected dark pattern details. The popup, in turn, displays these results to the user in an easily comprehensible format, offering insights into the nature and prevalence of dark patterns on the visited website.

This architecture maintains a clear flow of communication between the user interface, background processes, content script, and the cloud-based server. It enables efficient detection of dark patterns, enhancing the user's understanding of potential manipulations within the displayed content.

<hr>

## Mobile Application Architecture Overview:

Users kickstart the screenshot analysis process in the mobile app by uploading an image, triggering an Optical Character Recognition (OCR) algorithm. This advanced OCR mechanism extracts text content from the screenshot, transforming it into a structured format.

The extracted text data undergoes Base64 encoding, enhancing security and efficiency during transmission to the centralized Python server. The securely transmitted data includes both the Base64-encoded text and the original screenshot image, ensuring data integrity throughout the process.

On the server side, machine learning algorithms analyze the Base64-encoded text data and concurrently examine the screenshot image for the presence of dark patterns. If identified, the Python server dynamically modifies the image to highlight detected dark patterns while preserving the original context.

The enhanced image, along with any additional data, is then transmitted back to the mobile application, creating a feedback loop. Upon receiving the server response, the mobile app decodes any Base64-encoded data, ensuring accurate interpretation and display.

Users ultimately receive the modified image, providing visual insights into the presence of dark patterns within the uploaded screenshot. This comprehensive architecture seamlessly integrates OCR, machine learning, and dynamic image modification to enhance user understanding of potential manipulations within the analyzed content.

<hr>

