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

                $scope.addData = function() {
                    $scope.callback({data: $scope.form})
                }

            }
        };
    }]);
