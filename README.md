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
the script to your page and initialize it. The `'TRACKING_ID'` and
`'GALLERY_ID'` values must be substituted by the ones provided by Adsmurai.
 
 ```html
<script type="text/javascript" crossorigin="anonymous">
    const adsmuraiTrackingElement = document.createElement('script');
    adsmuraiTrackingElement.onload = function() {
        window.adsmurai_tracking = new AdsmuraiTracking('TRACKING_ID', 'GALLERY_ID');
        window.adsmurai_tracking.registerPageViewEvent();
    };
    adsmuraiTrackingElement.src = 'adsmurai-tracking.min.js';
    document.body.appendChild(adsmuraiTrackingElement);
</script>
```

## Usage (available event triggers)

### `adsmurai_tracking.registerCartViewEvent`
This event can be manually triggered each time the cart is loaded.

From a `<script>` tag:
```js
adsmurai_tracking.registerCartViewEvent();
```

### `adsmurai_tracking.registerGalleryViewEvent`
This event can be manually triggered each time a gallery is loaded. *If you are
a gallery user (but not a gallery developer) then you don't have to worry about
this event.*

From a `<script>` tag:
```js
const galleryGridWidth = 0;
const featuredImages = [
    {
        "imageId": "string",
        "position": 0,
        "gridX": 0,
        "gridY": 0
    },
];
adsmurai_tracking.registerGalleryViewEvent(galleryGridWidth, featuredImages);
```

### `adsmurai_tracking.registerPageViewEvent`
This event is automatically triggered on every page load. **Don't trigger it on
your own.** It must be triggered one single time per page view.

### `adsmurai_tracking.registerProductImageHoverEvent`
This event can be manually triggered each time a product image is hovered.
Note that the `ugcImage` parameter is optional.

From a `<script>` tag:
```js
const product = {
    productId: "a product id", 
    price: {
        amount: 42,
        currencyISOCode: "an iso currency code"
    }
};

const ugcImage = {
    "imageId": "string",
    "position": 0,
    "gridX": 0,
    "gridY": 0
};
adsmurai_tracking.registerUgcHoverEvent(product, ugcImage);
```


### `adsmurai_tracking.registerUgcClickEvent`
This event can be manually triggered each time an image is clicked.

From a `<script>` tag:
```js
const ugcImage = {
    "imageId": "string",
    "position": 0,
    "gridX": 0,
    "gridY": 0
};
adsmurai_tracking.registerUgcHoverEvent(ugcImage);
```


### `adsmurai_tracking.registerUgcClickEvent`
This event can be manually triggered each time an image is clicked.

From a `<script>` tag:
```js
const ugcImage = {
    "imageId": "string",
    "position": 0,
    "gridX": 0,
    "gridY": 0
};
adsmurai_tracking.registerUgcClickEvent(ugcImage);
```

## Build process
*This section is only for people actively developing this JS plugin. So if you
only care about how to use it, you can save your precious time.*

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
