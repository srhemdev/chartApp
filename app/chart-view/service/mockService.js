'use strict';

angular.module('myApp.chartView')
    .service('AppService', ['$q',function($q) {
        var vm = this;
        vm.dataFetcher = DataFetcher;

        function DataFetcher(urlFactory, delay) {
            var self = this;

            self.repeat = false;
            self.delay = delay;
            self.timer = null;
            self.requestObj = null;

            //request for next set  of data
            function getNext() {
                self.requestObj = $.ajax({
                    url: urlFactory()
                }).done(function(response) {
                    $(self).trigger("stateFetchingSuccess", {
                        result: response
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    $(self).trigger("stateFetchingFailure", {
                        error: textStatus
                    });
                }).always(function() {
                    if (self.repeat && _.isNumber(self.delay)) {
                        self.timer = setTimeout(getNext, self.delay);
                    }
                });
            }

            self.start = function(shouldRepeat) {
                self.repeat = shouldRepeat;
                getNext();
            };

            self.stop = function() {
                self.repeat = false;
                clearTimeout(self.timer);
            };

            self.repeatOnce = function() {
                getNext();
            };

            self.setDelay = function(newDelay) {
                this.delay = newDelay;
            };

            //post data to server endpoint
            self.postData = function(req) {
                var defer = $q.defer();
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/server_stat/server1',
                    data : req,
                    success: function(data) {
                        defer.resolve(data);
                    }
                });
                return defer.promise;
            }
        }
    }]);