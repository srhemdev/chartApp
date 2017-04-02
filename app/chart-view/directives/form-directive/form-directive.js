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
                $scope.hasError = false;
                $scope.addData = function() {
                    $scope.hasError = !checkProperties($scope.form);
                    if(!$scope.hasError) {
                        $scope.callback({data: $scope.form})
                    }
                }

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
