# Codelet

This is a simple bookmarklet that can scan QR codes in a browser. This was originally created for the [Hack Club](hackclub.com) YSYS [Hacklet](https://hacklet.hackclub.com/).

## Usage

The bookmarklet will prompt the user to select a QR code on screen. Once selected, it will be decoded.

This bookmarklet is not yet fully developed. It will only work on QR codes if the element selected contains no other visible artifacts. If the code is part of an image with a background that is not part of the code, it is unlikely to scan. Additionally, not all websites are compatible with Codelet. Opening the image in its own tab to run the bookmarklet can sometimes solve this later issue.

## Setup

To use this bookmarklet, simply copy the contents of the file [app.js](./src/app.js) and paste it into a bookmark.
