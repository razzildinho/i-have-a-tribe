'use strict';
/**
 * @ngInject
 */
var videoModel = function($http){

    var model = {};

    model.getVideos = function($scope, url){
        $http.get(url).success(function(res){
            if (res.success){
                $scope.videos = res.videos;
                $scope.activeVideo = $scope.videos[0];
            }
        })
        .error(function(){
        });
    }

    model.addVideo = function($scope, url){
        $http.post(url, {videoid: $scope.newVideo}).success(function(res){
            if (res.success){
                $scope.videos = res.videos;
                $scope.newVideo = '';
                if ($scope.activeVideo == null){
                    $scope.activeVideo = $scope.videos[0];
                }
            }
        })
        .error(function(){
        });
    }

    model.deleteVideo = function($scope, url, video){
        $http.post(url, video).success(function(res){
            if (res.success){
                $scope.videos = res.videos;
            }
        })
        .error(function(){
        });
    }

    return model;

};
