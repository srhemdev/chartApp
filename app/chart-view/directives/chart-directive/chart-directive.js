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
                $scope.barColor = $scope.config.barColors[0];
                $scope.lineColor = $scope.config.lineColors[0];


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

                function setYAxisTitle() {
                    var filtersNames = $scope.ySelected.map(function(item){return item.name;});
                    d3.select('.y-axis-text').text(filtersNames.join(', '));
                }

                function redraw() {
                    if (s) {
                        s.empty();
                    }
                    margin = {top: 50, right: 50, bottom: 100, left: 40};
                    width = $element[0].offsetWidth - margin.left - margin.right;
                    height = 650 - margin.top - margin.bottom;

                    x0 = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1);

                    x1 = d3.scale.ordinal();

                    x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                    y = d3.scale.linear().range([height, 0]);

                    line = d3.svg.line()
                        .x(function(d, i) {
                            return x0(d.date) + x1.rangeBand();
                        })
                        .y(function(d) {
                            return y(d.val);
                        });

                    xAxis = d3.svg.axis()
                        .scale(x0)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%H:%M:%S"));

                    yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(10);


                    svg = svgElement
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform",
                            "translate(" + margin.left + "," + margin.top + ")");

                    svg.append("text")
                        .attr('class', 'sb')
                        .attr("text-anchor", "middle")
                        .attr("transform", "translate("+ (width/2) +","+(height + 50)+")")  // centre below axis
                        .text($scope.config.xAxisName);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", "-.55em")
                        .attr("transform", "rotate(-90)" );

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

                redraw();

                $scope.$watch('data', function(n, o){
                    if(n!=o) {
                        updateView(n);
                    }
                }, true);

                $scope.$watch('ySelected', function(n, o){
                    $scope.filters = n.map(function(item){return item.prop;});
                    setYAxisTitle();
                    if(n!=o) {
                        updateView($scope.data);
                    }
                }, true);

                $scope.$watch('line', function(n, o){
                    if(n!=o && n) {
                        updateLine($scope.data)
                    }
                }, true);

                $scope.$watch('bar', function(n, o){
                    if(n!=o && n) {
                        updateBar($scope.data)
                    }
                }, true);

                $scope.$watch('lineColor', function(n, o) {
                    if(n) {
                        d3.selectAll(".line").style('stroke', n)
                    }
                }, true);

                $scope.$watch('barColor', function(n, o){
                    if(n) {
                        d3.selectAll(".barRect").style("fill", n)
                    }
                }, true);


                function updateView(newData) {

                    if(newData) {
                        removeBar(newData);
                        removeLine(newData);

                        svg.select('.x.axis').call(xAxis);
                        svg.select(".y.axis").call(yAxis)

                        newData.forEach(function(d) {
                            d.date = new Date(d.timestamp);
                        });

                        options = d3.keys(newData[0]).filter(function(key) {
                            return $scope.filters.indexOf(key) > -1;
                        });

                        newData.forEach(function(d) {
                            d.valores = options.map(function(name) {
                                return {name: name, value: +d[name]};
                            });
                        });



                        x0.domain(newData.map(function(d) {
                            return d.date;
                        }));
                        x1.domain(options).rangeRoundBands([0, x0.rangeBand()]);
                        y.domain([0, d3.max(newData, function(d) { return d3.max(d.valores, function(d) { return d.value; }); })]);


                        if($scope.bar) {
                            updateBar(newData)
                        }

                        if($scope.line) {
                            updateLine(newData)
                        }
                    }
                }

                function removeBar(oldData) {
                    var bars = svg.selectAll(".rect").data(oldData)
                    bars.remove();
                }

                function updateBar(newData) {
                    var bar = svg.selectAll(".bar")
                        .data(newData)
                        .enter().append("g")
                        .attr("class", "rect")
                        .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });

                    bar.selectAll("rect")
                        .data(function(d) { return d.valores; })
                        .enter().append("rect")
                        .attr('class', 'barRect')
                        .attr("width", x1.rangeBand())
                        .attr("x", function(d) { return x1(d.name); })
                        .attr("y", function(d) { return y(d.value); })
                        .attr("value", function(d){return d.name;})
                        .attr("height", function(d) { return height - y(d.value); })
                        .style("fill", function(d) {
                            if($scope.ySelected.length == 1) {
                                return $scope.barColor;
                            }
                            return color(d.name);
                        })
                        .style('opacity', 0.4)
                }

                function removeLine(oldData) {
                    var lines = svg.selectAll(".linePath").data(oldData)
                    lines.remove();
                }

                function updateLine(newData) {
                    var lines = options.map(function(id) {
                        return {
                            id: id,
                            values: newData.map(function(d) {
                                return {id: id, date: d.date, val: d[id]};
                            })
                        };
                    });

                    x.domain(d3.extent(newData, function(d) { return d.date; }));


                    var linePath = svg.append("g")
                        .attr("class", "linePath")
                        .selectAll(".linePath")
                        .data(lines)
                        .enter().append("g");



                    linePath.append("path")
                        .attr("class", "line")
                        .attr("d", function(d) {
                            return line(d.values);
                        })
                        .style("stroke", function(d) {
                            if($scope.ySelected.length == 1) {
                                return $scope.lineColor;
                            }
                            return color(d.id);
                        });
                }


                $element.on('$destroy', function() {
                });

                window.addEventListener("resize", redraw);
            }
        };
    }]);
