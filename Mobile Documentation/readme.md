# The Dark Pattern Detection System - NOVA

This is the official documentation for the NOVA mobile application, the cross-platform counterpart to our Web Extension, built to extract and highlight dark patterns from mobile screenshots.

## Beginner Resources

These are a few resources to get you started if this is your first Flutter project:

[Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab): Follow this official documentation tutorial to set up the Flutter Development Environment on your local system. This development tutorial uses the
VS Code IDE, however, this code is equally functional on the Android Studio Development Software.

[Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook): 
For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Extracting NOVA and Setting up Dependencies:
Extract the source code from the `NOVA Dark Pattern Buster Mobile Application Source Code` file and save the extracted directory. The following video shows how to extract and navigate to the required directory using Windows 11 and VS Code.

https://github.com/PreranaYekkele/DPBH/assets/95875573/04b950f1-39d9-4db7-8a4e-e7124f71f911

The file structure of the application follows native Flutter scaffolding, as instantiated when creating a new Flutter Application in VS Code using the Flutter SDK. 

```
/--NOVA Dark Patterns Buster Mobile Application (Source Code)
      /--Dark Patterns Back End Comms
            /------.idea
            /------main
                  /-------[Other Files]
                  /-------lib
                        /----- main.dart
                  /-------[Other Files]
                  /------- pubsec.yaml
```

The files of interest are as follows:
- `main.dart` is the main Flutter Application and the entry point of the app.
- `pubsec.yaml` handles dependencies. Any new dependencies are to be added to the dependencies portion of the file. Upon extraction, the required dependencies will be as follows:

```
dependencies:
  flutter:
    sdk: flutter  

  dash_bubble: ^2.0.0  #For Widget management

  screenshot: ^2.1.0  #Taking Screenshots in the Flutter App

  http: ^0.13.3   # Handle network requests

  flutter_lints: ^2.0.0 

  cupertino_icons: ^1.0.2  #icon pack 

  flutter_local_notifications: ^9.1.4  #Handle Notifications

  path_provider: ^2.0.2

  permission_handler: ^8.1.4+2  # Handle system perms

  image_picker: ^0.8.4+4  #Choose from gallery

  image: ^3.0.1 # To process images
```

To start setting up the application, navigate to the main folder of the app using the command line or terminal. You may also choose to directly open the main folder in any IDE (VSCode, Sublime, Android Studio):

```
PS C:\Users\USER_1\Downloads\NOVA - Dark Patterns Buster Mobile Application (Source Code)> cd '.\Dark Patterns Back End Comms\'
PS C:\Users\USER_1\Downloads\NOVA - Dark Patterns Buster Mobile Application (Source Code)\Dark Patterns Back End Comms> cd .\main\ 
```

Upon navigation install the dependencies onto your development machine using the following commands

```
flutter clean # Clean any outstanding files from previous builds 
flutter pub get # Install all dependencies to the local machine
```

## Connecting to the Backend:
It is required to set up the backend of the application. Configure the URI on line 90 in the `./main/lib/main.dart` file.
- Using the IP address of a system on a local network:
  - `var url = Uri.parse('http://192.168.*.*:8000/detect_darkness'); ` 
- Using the local host of the user system
  - `var url = Uri.parse('http://localhost:8000/detect_darkness');`
  - For users running on local host, ensure that the host is configured at '0.0.0.0' to ensure global visibility.
    ```
    if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)
    ```
    - Running using Uvicorn ```uvicorn app:app --host 0.0.0.0 --port 8000 --reload  ```
    - Running using python ``` python .\app.py ```  
- Using an API connected to a remote / cloud server
  - `var url = Uri.parse('http://CLOUD_API_END_POINT/detect_darkness');`



## Connecting to an Android Device:

- Ensure that `Developer Options` and `USB Debugging` are enabled on your Android device. Please make use of the following resources to set up USB Debugging:
[Enabling Developer Options and USB Debugging on Android Device](https://developer.android.com/studio/debug/dev-options)

- Once enabled, connect your device to the developer machine via USB and follow the on-screen prompts on your phone to set up the system as a trusted device.
- To confirm that the device has been connected and visible to the Flutter SDK, run the collowing command in your development environment:
  ```
  PS C:\Users\USER_1\Downloads\NOVA - Dark Patterns Buster Mobile Application (Source Code)\Dark Patterns Back End Comms> main> flutter devices
  ```
- All available devices will be displayed in the terminal
  ```
  Found 4 connected devices:
  A063 (mobile)     • P22316001846 • android-arm64  • Android 13 (API 33)
  Windows (desktop) • windows      • windows-x64    • Microsoft Windows [Version 10.0.22621.3007]
  Chrome (web)      • chrome       • web-javascript • Google Chrome 121.0.6167.86
  Edge (web)        • edge         • web-javascript • Microsoft Edge 121.0.2277.83
  ```
- As shown above the Android Device `A063 (mobile)` has been successfully detected by the Flutter SDK.

## Running the Flutter Application on Android Device

- Run the Flutter app on the Android Device by using the following command
  ```
  PS C:\Users\USER_1\Downloads\NOVA - Dark Patterns Buster Mobile Application (Source Code)\Dark Patterns Back End Comms> main> flutter run 
  ```
- Upon being prompted choose the device that should run the Flutter Application (Your device will be connected automatically if it is the only environment available)
  ```
  Connected devices:
  A063 (mobile)                • P22316001846  • android-arm64  • Android 13 (API 33)
  sdk gphone64 x86 64 (mobile) • emulator-5554 • android-x64    • Android 14 (API 34) (emulator)
  Windows (desktop)            • windows       • windows-x64    • Microsoft Windows [Version 10.0.22621.3007]
  Chrome (web)                 • chrome        • web-javascript • Google Chrome 121.0.6167.86
  Edge (web)                   • edge          • web-javascript • Microsoft Edge 121.0.2277.83
  [1]: A063 (P22316001846)
  [2]: sdk gphone64 x86 64 (emulator-5554)
  [3]: Windows (windows)
  [4]: Chrome (chrome)
  [5]: Edge (edge)
  Please choose one (or "q" to quit): 1
  ```
- The SDK will begin building the application on your mobile device

https://github.com/PreranaYekkele/DPBH/assets/95875573/7699b57f-bc17-49d1-a1b9-8548f08b5a54

## Using the App on Mobile:
The application is now ready for use on the mobile application. 

__NOTE__: Any changes made to the application while the app is running will require a hard reset for the changes to reflect in the app. Any changes to configuration files or dependencies will require a complete rebuilding of the application using the `flutter run` command. 

## Using the Application:
The application in the video (Horus Dark Patterns Buster) is our working prototype of the Flutter Application.
https://github.com/PreranaYekkele/DPBH/assets/95875573/8b4dafbe-c395-4616-8474-632bd84add17

