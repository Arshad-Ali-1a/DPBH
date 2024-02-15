## steps

make sure that you have android SDK and NDK (should come with sdk).
copy the files to pc, and run `npm install`.



run `npx expo prebuild` to generate the `android` directory. In android directory create a file called `local.properties`, and add the path of sdk and ndk to it.
example:
`
sdk.dir = C:/Users/Mohammad Arshad Ali/AppData/Local/Android/Sdk
ndk.dir = C:/Users/Mohammad Arshad Ali/AppData/Local/Android/Sdk/ndk/25.1.8937393
`


### AndroidManifest.xml
| open the AndroidManifest.xml file present in the rough folder, if needed


then go to `android\app\src\main` and open `AndroidManifest.xml` :
the following should be present, if not then add it near other uses-permission: 
`
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
`

also add the following near other intent-filter:
`
<intent-filter>
        <action android:name="android.intent.action.SEND"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data android:mimeType="image/*"/>
</intent-filter>
`


### running the app

connect your android via usb debugging, or wireless debugging, then
use `npm run android` to build the app... and if the app did not open automatically, press `a` in the terminal to open the app on mobile.

| NOTE: The sharing only works at the starting of the app, so if sharing doesn't work, remove the app from recent.. and then share, the app should open automatically.
