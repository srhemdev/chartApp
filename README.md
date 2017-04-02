-------------------------------
CHART APP
-------------------------------

Components:
--------------------------------

-- app (Main App Directory)

     -- chart-view
        -- directives
            -form-directive
              Contains form template which can be used to submit data to server
              and styles in form.css

            -chart-directive
             -The main chart component which takes in config like bar/line colors,
              y axis labels, x axis label etc and styles in chart css

        -- services
            -mockAPIs.js
             reusing existing functionality provided as a part of the project.
             This provide mock api responses using jQuery mockjax

            -mockService.js
             Contains the methods to request for data using a data fetcher(used from existing
             project) and also post data to server.



        -- chart-view.js
           This is the chart view module and points to the directive for form and
           chart.
           Has the controller logic to request for data and pass the the necessary views
           (directives).

        -- chart-view.css
           Contains chart module View specific styles.

        -- chart-view.html
           Is the template for the /charts route
           Points to the form and chart views.

        -- common.css
           Contains all the common css classes shared across different components.

     -- app.css
        Imports styles sheets from the various modules and directives and available as single
        file to the entry point.

     -- app.js
        Sets up the module for the enrty point in the app and provides a list of routes to
        which the application can point to. In our case /charts view.

     -- index.html
        -Entry point of the application.

    --- vendor
        Using existing jQuery Mockjax from given project.


    --- (bower_Components) libraries (Imported 3rd Party libraries)
        I have used AngularJS seed project to set up this environment for the angular App.
        -- AngularJS
        -- jQuery(from jquery.com)
        -- Modernizer
        -- Lodash
        -- jQuery Mockjax
        -- D3.js
        -- HTML5 BoilerPlate


---------------------------------------------------------------------------------------
CHOICE OF BROWSER TO RUN THE APPLICATION: CHROME (latest version preferred)
---------------------------------------------------------------------------------------



How to run the app:
------------------

--git clone https://github.com/srhemdev/chartApp

--npm install

--npm start

--Run http://localhost:8000/ in your browser.



Improvements:
-------------
- Can update unit tests and also karma configuration to run unit tests.
- Add gulp configuraton.
- Can use SASS framework to simplify stylesheets capitalizing on its abilities.









