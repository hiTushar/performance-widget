[demo](https://mf-perfomance.netlify.app/)  
# Steps
1. run the command `npm run build` 

2. a new folder, dist, is created with the build files. Inside dist -> assets, you have the .js and .css files.  

3. import these static files in the `<head>` of your target application  

4. add `<div id="performance-widget"></div>` to the markup where you want the widget - the main container '.widget-app' is absolutely positioned with z-index 10 and should be over rest of the components.  

# Other requirements / info
- add event listeners for the custom event 'expandWidget' which returns `event.detail = { expandWidget: true }` when the widget expand button is clicked and `{ detail: { expandWidget: false }}` when the widget collapse button is clicked.   
This can be used to trigger other events as the performance widget expands or collapses.  

- add event listeners for the custom event 'openSidepanel' which returns `event.detail = { sidePanel: true, hierarchy: { ring0: 'score0', ring1: 'score1', ring2: 'score2' } }` (where score0 is the `param_id` of the score clicked in the first ring and so on) when the a score parameter in the third/last tier/ring is clicked.   
This can be used to trigger other events.

- in the API response, make sure the 'param_score' for the score not relevant for a device is set to 'NA'. This way that score element is not clickable although it will appear in the UI to maintain the design.  