angular.module('myApp', ['ajoslin.mobile-navigate'])
    .config(function($routeProvider) {
        $routeProvider.when("/one", {
            templateUrl: "content/page1.html"
        }).when("/two", {
                templateUrl: "content/page2.html",
                transition: "modal" //this is overwritten by the go() in home.html
            }).when("/popup", {
                templateUrl: "content/popup.html",
                transition: "modal"
            }).when("/monkey", {
                templateUrl: "content/monkey.html"
            }).when("/backwards", {
                templateUrl: "content/backwards.html",
                reverse: true
            }).when("/login", {
                templateUrl: "content/login.html",
                reverse: true
            }).when("/", {
                templateUrl: "content/home.html"
            }).otherwise({
                redirectTo: "/"
            });
    })
    .run(function($route, $http, $templateCache) {
        angular.forEach($route.routes, function(r) {
            if (r.templateUrl) {
                $http.get(r.templateUrl, {cache: $templateCache});
            }
        });
    })
    .controller('MainCtrl', function($scope, $navigate) {
        $scope.$navigate = $navigate;
    })
/*    .directive('ngTap', function() {
        var isTouchDevice = !!("ontouchstart" in window);
        return function(scope, elm, attrs) {
            if (isTouchDevice) {
                var tapping = false;
                elm.bind('touchstart', function() { tapping = true; });
                elm.bind('touchmove', function() { tapping = false; });
                elm.bind('touchend', function() {
                    tapping && scope.$apply(attrs.ngTap);
                });
            } else {
                elm.bind('click', function() {
                    scope.$apply(attrs.ngTap);
                });
            }
        };
    })*/

    .directive('ngTap', function() {
        return function(scope, element, attrs) {
            var tapping;
            tapping = false;
            var movetime = 0;
            var elm = null;
            element.bind('touchstart', function(e) {
                console.log('touchstart');
                element.addClass('active');
                tapping = true;
                elm = element;
            });
            element.bind('touchmove', function(e) {
                console.log('touchmove: ' + (e.timeStamp - movetime));
                if (movetime == 0)
                    movetime = e.timeStamp;
                else if (e.timeStamp - movetime > 300)
                {
                    element.removeClass('active');
                    movetime = 0;
                    tapping = false;
                }
            });
            element.bind('touchend', function(e) {
                element.removeClass('active');
                console.log('touchend');
                if (tapping) {
                    scope.$apply(attrs['ngTap'], element);
                }
            });
        };
    });

function formController($scope, $http, $templateCache){
    $scope.submit=function(){
        $scope.url = "http://hostpost.org/api/test.php";
//        $scope.url = "content/monkey.html";
        $scope.method = "GET";

        $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
            success(function(data, status) {
                $scope.status = status;
                $scope.data = data;
                alert($scope.status + ' = ' + $scope.data)
            }).
            error(function(data, status) {
                $scope.data = data || "Request failed";
                $scope.status = status;
                alert($scope.status + ' = ' + $scope.data)
            });
    }
}