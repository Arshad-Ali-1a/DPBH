# NOVAS mobile API Overview

## Introduction

The NOVAS mobile API is a powerful tool designed to enhance user experience within mobile applications by identifying and addressing potentially deceptive user interfaces. Dark patterns refer to design elements that may manipulate or mislead users, and this API aims to detect and highlight such patterns in images.

## Purpose

The primary purpose of the NOVAS mobile API is to empower mobile applications to create a more transparent and honest user experience. By analyzing images containing user interfaces, the API identifies elements that might be designed to deceive or manipulate users, thus allowing developers to take appropriate actions.

## How It Works

The API utilizes advanced image processing techniques and Optical Character Recognition (OCR) technology to extract text and analyze the layout of the user interface. It then communicates with an external dark pattern detection service, which evaluates the extracted information to identify potential dark patterns. The API finally returns highlighted images, showcasing the detected dark patterns, along with relevant information.

The API employs a text highlighting mechanism to draw attention to identified dark patterns. When potential dark patterns are detected within the user interface, the API dynamically highlights the relevant text on the image. This highlighting is achieved by adding a visually distinct color around the text, making it easily noticeable to both developers and end-users.

## Key Features

- **Dark Pattern Detection:** The API identifies and highlights potential dark patterns in user interface images, such as misleading prompts, hidden costs, or coercive tactics.
  
- **Highlighting:** The API returns an image with all the detected dark patterns Highlighted.

- **Privacy:** All the images are sent in encoded format, and when the processing is done, the images are deleted. No data is permanently stored to respect the user's privacy.


## Integration

The NOVAS mobile API is designed for easy integration into the mobile application. Developers can incorporate the API, by hosting it in the cloud, or a local server.
