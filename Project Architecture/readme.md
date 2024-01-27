# System Architecture

![Architecture](../images/architecture.png)

## Interacting with Chrome Extension:

**1. Extension Action:**
   - The Chrome extension, equipped with web scraping capabilities, initiates the dynamic analysis of the webpage to detect potential dark patterns.

**2. Automated Web Scraping:**
   - Utilizing automated web scraping capabilities, the extension carefully extracts relevant data and page elements from the website.

**3. Data Processing:**
   - Extracted data is processed within the extension, ensuring necessary properties are retained while eliminating unnecessary information to streamline transmission.

**4. Data Transmission:**
   - Processed data is transmitted from the Chrome extension to the cloud-hosted Python server.

**5. Machine Learning Analysis:**
   - On the server side, advanced machine learning models analyze the data to identify dark patterns based on insights gained from model training.

**6. Highlighting Dark Patterns:**
   - Identified dark patterns are relayed to the Chrome extension, dynamically highlighting them on the website in real-time.
   - Users receive immediate feedback within their browser, providing insights into potential dark patterns as they navigate the website.

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

