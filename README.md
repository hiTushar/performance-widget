[demo](https://mf-perfomance.netlify.app/)  
# Steps
1. run the command `npm run build` 

2. a new folder, dist, is created with the build files. Inside dist -> assets, you have the .js and .css files.  

3. import these static files in the `<head>` of your target application  

4. add `<div id="performance-widget"></div>` to the markup where you want the widget - the main container '.widget-app' is absolutely positioned with z-index 10 and should be over rest of the components.  

5. add event listeners for the custom event 'expand' which returns `{ detail: { expand: true  }}` and `{ detail: { expand: false  }}` and can be used to trigger other events as the performance widget is expands or collapses.  

