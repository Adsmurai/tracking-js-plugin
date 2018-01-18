# Adsmurai tracking plugin

## First steps

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
