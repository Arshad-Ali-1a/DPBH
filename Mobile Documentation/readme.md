# The Dark Pattern Detection System - NORUS

This is the official documentation for the NOVA mobile application, the cross-platform counterpart to our Web Extension, built to extract and highlight dark patterns from mobile screenshots.

## Beginner Resources

These are a few resources to get you started if this is your first Flutter project:

[Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab): Follow this official documentation tutorial to set up the Flutter Development Environment on your local system. This development tutorial uses the
VS Code IDE, however, this code is equally functional on the Android Studio Development Software.

[Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook): 
For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Setting Up Nova on your local Android System:
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
    sdk: flutter # To set up the Flutter Environment
  dash_bubble: ^2.0.0 # For Widget management
  screenshot: ^2.1.0  #To handle taking Screenshots in the Flutter App
  http: ^0.13.3  # To handle network requests
  flutter_lints: ^2.0.0 
  cupertino_icons: ^1.0.2 # icon pack 
  flutter_local_notifications: ^9.1.4 # To generate notifications
  path_provider: ^2.0.2
  permission_handler: ^8.1.4+2 # To handle system perms
  image_picker: ^0.8.4+4 # To allow users to choose images form image tray
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

