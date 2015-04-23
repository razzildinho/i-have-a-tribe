'use strict';

(function(){
    /**
     * @ngInject
     */
    angular.module('app', ['ui.router', 'ngAnimate'], function($httpProvider){
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.interceptors.push('authInterceptor');

        /**
        * The workhorse; converts an object to x-www-form-urlencoded serialization.
        * @param {Object} obj
        * @return {String}
        */ 
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
          
            for(name in obj) {
                value = obj[name];
            
                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null){
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
          
            return query.length ? query.substr(0, query.length - 1) : query;
        };
     
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    });

    var MainConfig = function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './templates/home.html',
            })
            .state('video', {
                url: '/video',
                templateUrl: './templates/video.html',
                controller: 'VideoCtrl as video'
            })
            .state('listen', {
                url: '/listen',
                templateUrl: './templates/listen.html',
            })
            .state('shows', {
                url: '/shows',
                templateUrl: './templates/shows.html',
                controller: 'ShowsCtrl as shows'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: './templates/contact.html',
            })
            .state('social', {
                url: '/social',
                templateUrl: './templates/social.html',
            });

    };

    angular
        .module('app')
        .service('$anchorSmoothScroll', anchorSmoothScroll)
        .directive('scrollSpy', scrollSpy)
        .directive('spyer', spy)
        .directive('updateTitle', updateTitle)
        .directive('errSrc', errSrc)
        .directive('youtube', youtube)
        .directive('dateTimePicker', dateTimePicker)
        .directive('checkHeight', checkHeight)
        .factory('globalModel', globals)
        .factory('showsModel', showsModel)
        .factory('userModel', userModel)
        .factory('videoModel', videoModel)
        .factory('authInterceptor', authInterceptor)
        .controller('MainCtrl', MainCtrl)
        .controller('HomeCtrl', HomeCtrl)
        .controller('VideoCtrl', VideoCtrl)
        .controller('ShowsCtrl', ShowsCtrl)
        .controller('ShowsFormCtrl', ShowsFormCtrl)
        .controller('ContactCtrl', ContactCtrl)
        .config(MainConfig);

})();

