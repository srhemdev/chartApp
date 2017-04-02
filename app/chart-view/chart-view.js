'use strict';

angular.module('myApp.chartView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/charts', {
    templateUrl: 'chart-view/chart-view.html',
    controller: 'ChartViewCtrl'
  });
}])

.controller('ChartViewCtrl', ['AppService', '$scope', '$timeout',function(AppService, $scope, $timeout) {
    $scope.records = [];
    $scope.start = start;
    $scope.stop = stop;
    $scope.addData = addData;

    var yAxisNames = [{name: 'Memory Usage', prop: 'memory_usage'},
        {name: 'CPU Usage', prop:'cpu_usage'},
        {name: 'Memory Available', prop:'memory_available'},
//        {name: 'Network Throughput IN', prop:'throughput_in'},
//        {name: 'Network Throughput OUT', prop:'throughput_out'},
//        {name: 'Network Packet IN', prop:'packet_in'},
//        {name: 'Network Packet IN', prop:'packet_out'},
//        {name: 'Errors System', prop:'error_system'},
//        {name: 'Errors Sensor', prop:'error_sensor'},
//        {name: 'Errors Component', prop:'error_component'}
    ];

    $scope.config = {
        yAxisNames: yAxisNames,
        xAxisName: 'Time Series',
        barColors: ['steelblue', 'lightgrey', 'lightblue'],
        lineColors: ['teal', 'pink', 'olive']
    };

    var counter = 0, limit = 4,
    df = new AppService.dataFetcher(function() {
        var startTime = new Date(),
            endTime = new Date(startTime.getTime() + 1000),
            queryParam = ["from=", startTime.getTime(), "&to=", endTime.getTime()].join("");

        return ["/server_stat/", "server1", "?" + queryParam].join("");
    }, 1000);


    function init() {
        $(df).on({
            "stateFetchingSuccess": function(event, data) {
                if(++counter > limit) {
                    $scope.records.splice(0, 1)
                }
                $scope.records.push(data.result.data[0]);
                $scope.$apply();
            },
            "stateFetchingFailure": function(event, data) {
//                if(++counter > limit) {
//                    $scope.records.splice(0, 1)
//                }
//                $scope.records.push('error');
//                $scope.$apply();
            }
        });
        start();
    }

    function start() {
        df.start(true);
    }

    function stop() {
        df.stop(true);
    }

    init();

    function addData(form) {
        var req = {
            timestamp: (new Date()).toISOString(),
            memory_usage: form.memory_usage,
            memory_available: form.memory_available,
            cpu_usage: form.cpu_usage,
            network_throughput: {
                in: form.throughput_in,
                out: form.throughput_out
            },
            network_packet: {
                in: form.packet_in,
                out: form.packet_out
            },
            errors: {
                system: form.error_system,
                sensor: form.error_sensor,
                component: form.error_component
            }
        }

        df.postData(req).then(function(res){
            if(res) {
                if(++counter > limit) {
                    $scope.records.splice(0, 1)
                }

                $scope.records.push(res[0]);
            }
        });
    }
}]);