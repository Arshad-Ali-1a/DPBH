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

## Interacting with Mobile Application:

**1. Screenshot Analysis:**
   - Users initiate the process by uploading a screenshot, triggering a robust Optical Character Recognition (OCR) process within the mobile app.

**2. OCR and Text Extraction:**
   - The OCR algorithm performs advanced text extraction, converting screenshot content into a structured format.

**3. Data Encoding with Base64:**
   - Extracted text data is encoded using Base64 for secure and efficient transmission to the centralized Python server.

**4. Data Transmission:**
   - Base64-encoded text data and the original image are securely transmitted to the Python server, ensuring data integrity.

**5. Machine Learning-driven Image Analysis:**
   - Advanced machine learning algorithms on the server side process the Base64-encoded text data and concurrently analyze the screenshot image for dark patterns.

**6. Dynamic Image Modification:**
   - If dark patterns are identified, the Python server dynamically modifies the image, emphasizing detected dark patterns while preserving the original context.

**7. Modified Image Transmission:**
   - The enhanced image, along with any additional data, is transmitted back to the mobile application, completing the feedback loop.

**8. Data Decoding with Base64:**
   - Upon receiving the server response, the mobile application decodes any Base64-encoded data, ensuring accurate interpretation and display.

**9. User Insight Delivery:**
   - Users receive the modified image, providing visual insights into the presence of dark patterns within the uploaded screenshot.

<hr>

