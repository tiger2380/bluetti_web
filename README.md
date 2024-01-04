# Bluetti Web (Data Extraction)
** Only works for AC200Max, AC300 and AC500 **

This is a simple Javascript-based site that connects to a Bluetti device and extracts data via BlueTooth.

  1. Download or clone this repository
  2. Extract/open that repo that you just downloaded/cloned.
  3. Go into that folder and double-click on the `index.html` file.
  4. That's it. No download is required.

## Browser configuration
You might need to enable Bluetooth capacity within your browser. (I have only tested on Chrome)
To do so, do the following steps:
  #### Chrome\Edge
  1. Enable Bluetooth Device Permission Settings in Chrome
  2. Open the Google Chrome browser.
  3. Type the following text in the address bar: chrome://flags/
  4. enable-web-bluetooth-new-permissions-backend.
  5. Select Enabled from the drop-down list next to the Use the new permissions backend for Web Bluetooth.

## Usage
Once you have downloaded/cloned the repo and enabled the flag(if needed), you are now able to connect to your Bluetti devices.
You can only connect to one Bluetti device at a time.
  #### connect
  - On the website, click on the `connect` button.
  - A dialog will pop up with a list of Bluetti devices(Only AC300, AC200Max, and AC500)
  - Click on the device that you want to connect to and click on `OK`.
  ### UI
  On the top of the page, you see all the data that were extracted from your device.
  At the bottom of the page, you will see useful charts. 
