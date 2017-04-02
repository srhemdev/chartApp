'use strict';

describe('myApp.chartView module', function() {

  beforeEach(module('myApp.chartView'));

  describe('chartView controller', function(){

    it('should be defined', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('ChartViewCtrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});