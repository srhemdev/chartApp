(function () {
    $.mockjaxSettings.logging = 0;  // only critical error messages

        function getResponderWithFailureRate(url, urlParams, responseFunc, failureRate) {
        return function(requestSettings) {
            var service = requestSettings.url.match(url);

            if (service) {
                var mockDefinition = {
                    type: "GET",
                    url: url,
                    urlParams: urlParams,
                    contentType: "application/json"
                };

                if (Math.random() < failureRate) {
                    mockDefinition = _.assign(mockDefinition, {
                        status: 500,
                        response: "An Internal Server Error!!!"
                    });
                } else {
                    mockDefinition = _.assign(mockDefinition, {
                        status: 200,
                        response: responseFunc
                    });
                }

                return mockDefinition;
            }

            return;
        };
    }

    function getServerStatResponse(startTime, endTime, serverID) {
        var records = [],
            memUpperBound = 40000,
            throughputUpperBound = 20000,
            packetUpperBound = 1000,
            errorUpperBound = 5;

        for (var ts = startTime; ts < endTime; ts += 1000) {
            records.push({
                timestamp: (new Date(ts)).toISOString(),
                memory_usage: _.random(memUpperBound),
                memory_available: _.random(memUpperBound),
                cpu_usage: Number(Math.random()).toFixed(2),
                network_throughput: {
                    "in": _.random(throughputUpperBound),
                    out: _.random(throughputUpperBound)
                },
                network_packet: {
                    "in": _.random(packetUpperBound),
                    out: _.random(packetUpperBound)
                },
                errors: {
                    system: _.random(errorUpperBound),
                    sensor: _.random(errorUpperBound),
                    component: _.random(errorUpperBound)
                }
            });
        }

        return {
            header: {
                target_name: serverID,
                time_range: {
                    start: new Date(startTime).toISOString(),
                    end: new Date(endTime).toISOString()
                },
                recordCount: records.length
            },
            data: records
        };
    }

    function updateServerStatResponse(data) {
        return  [data];
    }

    function logger(title, settings, response) {
//        console.info("\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/");
//        console.info("| Request URL", settings.url);
//        console.info("| ", title, response);
//        console.info("/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\");
    }

    var handler1 = getResponderWithFailureRate(
            /^\/server_stat\/(.*)\?from=(\d+)\&to=(\d+)$/,
            ["serverID", "startTime", "endTime"],
            function(settings) {
                var st = parseInt(settings.urlParams.startTime),
                    et = parseInt(settings.urlParams.endTime),
                    serverName = settings.urlParams.serverID;

                this.responseText = getServerStatResponse(st, et, serverName);

                logger("Server Statistic Response:", settings, this.responseText);
            },
            0.2
        );

    $.mockjax(handler1);

    $.mockjax({
        url: '/server_stat/server1',
        type: "POST",
        responseTime: 750,
        response: function (settings) {
            this.responseText = updateServerStatResponse(settings.data);
        }
    });
})();
