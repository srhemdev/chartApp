'use strict';

angular.module('myApp.chartView')
    .directive('chartDirective', [function() {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                config: '='
            },
            templateUrl: 'chart-view/directives/chart-directive/chart.html',
            link: function($scope, $element, $attrs) {
                $scope.bar = true;
                $scope.line = true;

                $scope.ySelected = $scope.config.yAxisNames;


                var margin,
                    width,
                    height,
                    x,
                    xAxis,
                    yAxis,
                    line,
                    s = $element.find('svg'),
                    svgElement = d3.select(s[0]),
                    svg, x0, x1, y, options,
                    colorRange = d3.scale.category20(),
                    color = d3.scale.ordinal()
                    .range(colorRange.range());

                $scope.barColors = colorRange.range()
                $scope.lineColors = colorRange.range()
                $scope.barColor = $scope.barColors[0];
                $scope.lineColor = $scope.lineColors[0];

                //set y axis title based on selected options.
                function setYAxisTitle() {
                    var filtersNames = $scope.ySelected.map(function(item){return item.name;});
                    d3.select('.y-axis-text').text(filtersNames.join(', '));
                }

                /**
                 *  function to draw the svg element and initialize the
                 *  canvas for the charts.
                 */
                function redraw() {
                    if (s) {
                        s.empty();
                    }
                    margin = {top: 50, right: 50, bottom: 100, left: 40};
                    width = $element[0].offsetWidth - margin.left - margin.right;
                    height = 650 - margin.top - margin.bottom;

                    //set multi bar chart x axis scale
                    x0 = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1);

                    x1 = d3.scale.ordinal();

                    //set multi line chart x axis scale
                    x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                    //set multi line & bar chart y axis scale
                    y = d3.scale.linear().range([height, 0]);

                    //set line path function for x and y values
                    line = d3.svg.line()
                        .x(function(d, i) {
                            return x0(d.date) + x1.rangeBand();
                        })
                        .y(function(d) {
                            return y(d.val);
                        });

                    //set x axis ticks
                    xAxis = d3.svg.axis()
                        .scale(x0)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%H:%M:%S"));

                    //set y axis ticks
                    yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(10);

                    //set svg canvas width and height
                    svg = svgElement
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                    //set x axis title
                    svg.append("text")
                        .attr('class', 'sb')
                        .attr("text-anchor", "middle")
                        .attr("transform", "translate("+ (width/2) +","+(height + 50)+")")  // centre below axis
                        .text($scope.config.xAxisName);


                    //set x axis ticks text position
                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end");

                    //set y axis title & position
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr('class', 'y-axis-text sb')
                        .attr("y", -40)
                        .attr("x", $element[0].offsetLeft)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text($scope.ySelected.name);

                    setYAxisTitle();
                }

                //Init the chart
                redraw();

                //Watch for data changes
                $scope.$watch('data', function(n, o){
                    if(n!=o) {
                        updateView(n);
                    }
                }, true);

                //Watch for Y parameter selection
                $scope.$watch('ySelected', function(n, o){
                    $scope.filters = n.map(function(item){return item.prop;});
                    setYAxisTitle();
                    if(n!=o) {
                        updateView($scope.data);
                    }
                }, true);

                //Watch for Line chart selection
                $scope.$watch('line', function(n, o){
                    if(n!=o && n) {
                        updateLine($scope.data)
                    }
                }, true);

                //Watch for Bar chart selection
                $scope.$watch('bar', function(n, o){
                    if(n!=o && n) {
                        updateBar($scope.data)
                    }
                }, true);

                /**
                 * Watch for Line chart color selection
                 * This only comes into function if we have
                 * a single selected y param.
                 */
                $scope.$watch('lineColor', function(n, o) {
                    if(n) {
                        d3.selectAll(".line").style('stroke', n)
                    }
                }, true);

                /**
                 * Watch for Bar chart color selection
                 * This only comes into function if we have
                 * a single selected y param.
                 */
                $scope.$watch('barColor', function(n, o){
                    if(n) {
                        d3.selectAll(".barRect").style("fill", n)
                    }
                }, true);

                //Update the view due to any of the watcher or window resize changes
                function updateView(newData) {

                    if(newData) {
                        //Clear the chart each time there is a change
                        removeBar(newData);
                        removeLine(newData);

                        //Update x and y axis positions
                        svg.select('.x.axis').call(xAxis);
                        svg.select(".y.axis").call(yAxis)

                        //Add date property for X axis scale to each data object
                        newData.forEach(function(d) {
                            d.date = new Date(d.timestamp);
                        });

                        //Get the selected options(y params)
                        options = d3.keys(newData[0]).filter(function(key) {
                            return $scope.filters.indexOf(key) > -1;
                        });

                        //Map the data based on selected options(y params)
                        newData.forEach(function(d) {
                            d.valores = options.map(function(name) {
                                return {name: name, value: +d[name]};
                            });
                        });


                        //Set x axis domain values
                        x0.domain(newData.map(function(d) {
                            return d.date;
                        }));

                        //Set range for multi bar chart based on options
                        x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);


                        //set x domain for line chart
                        x.domain(d3.extent(newData, function(d) { return d.date; }));

                        //Ste Y axis domain based on the highest values among all the options
                        y.domain([0, d3.max(newData, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);

                        //If Bar chart is selected update it
                        if($scope.bar) {
                            updateBar(newData)
                        }

                        //If Line chart is selected update it
                        if($scope.line) {
                            updateLine(newData)
                        }
                    }
                }

                //Clear bar chart
                function removeBar(oldData) {
                    var bars = svg.selectAll(".rect").data(oldData)
                    bars.remove();
                }

                //Update bar chart with new set of data
                function updateBar(newData) {
                    //Create a g element which holds all the bars(rects) associates with an x axis label
                    var bar = svg.selectAll(".bar")
                        .data(newData)
                        .enter().append("g")
                        .attr("class", "rect")
                        .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });

                    //set colors and width for each bar in the multi bar
                    bar.selectAll("rect")
                        .data(function(d) { return d.valores; })
                        .enter().append("rect")
                        .attr('class', 'barRect')
                        .attr("width", x1.rangeBand())
                        .attr("x", function(d) { return x1(d.name); })
                        .attr("y", function(d) { return y(d.value); })
                        .attr("value", function(d){return d.name;})
                        .attr("height", function(d) { return height - y(d.value); })
                        .attr("style",function(d,i) {
                            /**
                             *  assign colors based on how many y params are selected
                             *  if it is 1 bar select from dropdown options
                             *  else assign randomly
                             */

                            var exp = ($scope.ySelected.length === 1) ? $scope.barColor: color(i);
                            return "fill:" + exp + ";fill-opacity:0.2; stroke:" +
                                exp + ";stroke-width:2px";
                        });

                }

                //Clear line chart
                function removeLine(oldData) {
                    var lines = svg.selectAll(".linePath").data(oldData)
                    lines.remove();
                }

                //Update line chart
                function updateLine(newData) {
                    //set lines data based on the options selected
                    var lines = options.map(function(id) {
                        return {
                            id: id,
                            values: newData.map(function(d) {
                                return {id: id, date: d.date, val: d[id]};
                            })
                        };
                    });


                    //Create a g element which contains the line path for each option
                    //data
                    var linePath = svg.append("g")
                        .attr("class", "linePath")
                        .selectAll(".linePath")
                        .data(lines)
                        .enter().append("g");

                    //Append the line path to each g element
                    linePath.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) {
                            return line(d.values);
                        })
                        .style("stroke", function(d, i) {
                            // assign colors based on how many y params are selected or just assign
                            //select dropdown color
                            return ($scope.ySelected.length === 1) ? $scope.lineColor: color(i);
                        });
                }


                $element.on('$destroy', function() {
                });

                //Redraw chart on window resize event
                window.addEventListener("resize", redraw);
            }
        };
    }]);
