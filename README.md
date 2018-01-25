# Adsmurai tracking plugin

**WARNING:** This project is in alpha state.

## Quick start

### Installation
* To install this script through NPM:
  `npm install adsmurai-tracker`.
* To install this script through YARN:
  `yarn add adsmurai-tracker`.
  
 ### Initialization
 Copy this snippet anywhere inside the `<body>` tag of your html file to add 
 the script to your page and initialize it.
 
 ```html
<script type="text/javascript" crossorigin="anonymous">
    const TRACKING_ID = 'dev-tracking-id';
    const GALLERY_ID = 'dev-gallery-id';
    
    const adsmuraiTrackingElement = document.createElement('script');
    adsmuraiTrackingElement.onload = function() {
        window.adsmurai_tracking = new AdsmuraiTracking(TRACKING_ID, GALLERY_ID);
        window.adsmurai_tracking.registerPageViewEvent();
    };
    adsmuraiTrackingElement.src = 'adsmurai-tracking.min.js';

    document.head.appendChild(adsmuraiTrackingElement);
</script>
```

### Usage
From a `<script>` tag:
```js
const galleryGridWidth = ...;
const faturedImages = ...;
adsmurai_tracking.registerGalleryViewEvent(galleryGridWidth, featuredImages);
```

## Build process

In order to use this plugin, you must build it with the following command:
```bash
yarn build
```

The results will be in the `./dist` directory:
  * `adsmurai-tracking.min.js` - A full featured script without external
    dependencies, it works out of the box.
  * `adsmurai-tracking.lite.min.js` - This version assumes that the
     FingerprintJS2 library is previously loaded, if not then it dynamically
     inserts the script into the DOM.

## Available event triggers

  * `adsmurai_tracking.registerPageViewEvent`: This event is automatically
    triggered on every page load. **Don't trigger it on your own.** It must be
    triggered one single time per page view.
    
  * `adsmurai_tracking.registerGalleryViewEvent`: This event can be manually 
    triggered each time a gallery is loaded.
