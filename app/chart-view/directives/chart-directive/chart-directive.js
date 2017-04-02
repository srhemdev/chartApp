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

                $scope.ySelected = $scope.config.yAxisNames[0];
                $scope.barColor = $scope.config.barColors[0];
                $scope.lineColor = $scope.config.lineColors[0];


                var margin,
                    width,
                    height,
                    x, y,
                    xAxis,
                    yAxis,
                    valueline,
                    s = $element.find('svg'),
                    svgElement = d3.select(s[0]),
                    svg;


                function redraw() {
                    if (s) {
                        s.empty();
                    }
                    margin = {top: 50, right: 50, bottom: 100, left: 40};
                    width = $element[0].offsetWidth - margin.left - margin.right;
                    height = 650 - margin.top - margin.bottom;

                    x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

                    y = d3.scale.linear().range([height, 0]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(d3.time.format("%H:%M:%S"));

                    yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(10);

                    valueline = d3.svg.line()
                        .x(function(d) { return x(d.date) + parseInt(x.rangeBand()/2, 10); })
                        .y(function(d) { return y(d[$scope.ySelected.prop]); });

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

                }

                redraw();

                $scope.$watch('data', function(n, o){
                    if(n!=o) {
                        updateView(n, o);
                    }
                }, true);

                $scope.$watch('ySelected', function(n, o){
                    if(n!=o) {
                        updateView($scope.data);
                        d3.select('.y-axis-text').text(n.name);
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

                $scope.$watch('lineColor', function(n, o){
                    if(n!=o && n) {
                        d3.select('.line').attr('stroke', n)
                    }
                }, true);

                $scope.$watch('barColor', function(n, o){
                    if(n!=o && n) {
                        d3.select('.bar').style("fill", n)
                    }
                }, true);


                function updateView(newData, oldData) {

                    if(oldData) {
                        removeBar(oldData);
                        removeLine(oldData);
                    }

                    svg.select('.x.axis').call(xAxis);
                    // same for yAxis but with more transform and a title
                    svg.select(".y.axis").call(yAxis)

                    newData.forEach(function(d) {
                        d.date = new Date(d.timestamp);
                        d.throughput_in = d.network_throughput.in;
                        d.throughput_out = d.network_throughput.out;
                        d.packet_in = d.network_packet.in;
                        d.packet_out = d.network_packet.out;
                        d.error_system = d.errors.system;
                        d.error_sensor = d.errors.sensor;
                        d.error_component = d.errors.component;

                        d.value = d[$scope.ySelected.prop];
                    });

                    x.domain(newData.map(function(d) { return d.date; }));
                    y.domain([0, d3.max(newData, function(d) { return d.value; })]);

                    if($scope.bar) {
                        updateBar(newData)
                    }

                    if($scope.line) {
                        updateLine(newData)
                    }

                }

                function removeBar(oldData) {
                    var bars = svg.selectAll(".bar").data(oldData)
                    bars.remove();
                }

                function updateBar(newData) {

                    svg.selectAll("bar")
                        .data(newData)
                        .enter().append("rect")
                        .attr('class', 'bar')
                        .style("fill", $scope.barColor)
                        .attr("x", function(d) { return x(d.date); })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d) { return height - y(d.value); });
                }

                function removeLine(oldData) {
                    var line = svg.selectAll(".line").data(oldData)
                    line.remove();
                }

                function updateLine(newData) {
                    svg.append("path")
                        .attr("class", "line")
                        .attr("stroke", $scope.lineColor)
                        .attr("d", valueline(newData));
                    // Make the changes
//                    svg.select(".line")   // change the line
//                        .duration(750)
//                        .attr("d", valueline(newData));
                }


                $element.on('$destroy', function() {
                });

                window.addEventListener("resize", redraw);
            }
        };
    }]);
