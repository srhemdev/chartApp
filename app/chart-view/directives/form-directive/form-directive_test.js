'use strict';

describe('myApp.chartView module', function() {

  beforeEach(module('myApp.chartView'));

    describe('form directive', function(){

        it('should be defined', inject(function($rootScope, $compile) {
            //spec body
            var $scope = $rootScope.$new();
            var element = angular.element("<div form-directive></div>");
            var template = $compile(element)($scope);
            $scope.$digest();
            console.log(template)
            //expect(view1Ctrl).toBeDefined();
        }));

    });
});