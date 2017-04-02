'use strict';

describe('myApp.chartView module', function() {

  beforeEach(module('myApp.chartView'));

  describe('chart directive', function(){

    it('should be defined', inject(function($rootScope, $compile) {
        var data = {}
        var $scope = $rootScope.$new();
        var element = angular.element("<div chart-directive data=''></div>");
        var template = $compile(element)($scope);
        $scope.$digest();
        }));

    });
});