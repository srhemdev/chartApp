'use strict';

angular.module('myApp.chartView')
    .directive('formDirective', [function() {
        return {
            restrict: 'EA',
            scope: {
                callback: '&'
            },
            templateUrl: 'chart-view/directives/form-directive/form.html',
            link: function($scope, $element, $attrs){
                //hide/show error message
                $scope.hasError = false;

                //add data to be submitted to server, check if all values are present.
                $scope.addData = function() {
                    $scope.hasError = !checkProperties($scope.form);
                    if(!$scope.hasError) {
                        $scope.callback({data: $scope.form})
                    }
                }

                //function to check if all properties are present.
                function checkProperties(obj) {
                    if(!obj) return false;
                    for (var key in obj) {
                        if (obj[key] === null || obj[key] === "")
                            return false;
                    }
                    return true;
                }

            }
        };
    }]);
