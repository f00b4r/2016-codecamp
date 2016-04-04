Application skeleton
=============================

Before the application can run you need to

* Install npm dependencies
```
npm install
```
* Install bower dependencies
```
bower install
```
* Copy used bower js and css libs and fonts to the app
```
gulp bowerlibs
```

Using ES6 (babel) in app
------------------------
It's simple. Just set extension of your file to .es6.js and put it in some of the app-folders (www/model, www/app, www/view).
Don't forget that these files must be transpiled to Vanilla javascript, so you have to serve them from www/build/ folder.
Don't worry about directory structure where are files compiled, it mimics current folder structure.
So if you want to use ES6 version of you file, just put build/ in fron of the path in ```<script>``` tag in index.html.

Application structure
---------------------
```
+- bower_components (bower libraries)
+- hooks (something cordova needs)
+- node_modules (node libraries)
+- resources (app icons and splash screens)
+- scss
|  +- partials
|  +- ui
|  +- views (scss for specific views)
|  \- ionic.app.scss (main scss that imports all the others)
|
\- www
   +- app
   |  +- app.js
   |  \- config.js
   |
   +- css (generated css files from scss and bower libs)
   +- fonts (fonts from bower libraries)
   +- img (images used in the app)
   +- js (bower js and code used across apps)
   +- model (app specific models)
   |  \- global-service.js
   |
   +- views (app specific views)
   |  |
   |  \- main
   |     \- main.js
   \- index.html
```