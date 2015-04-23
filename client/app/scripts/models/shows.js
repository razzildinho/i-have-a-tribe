/**
 * @ngInject
 */
var showsModel = function($http){

    var model = {};

    model.getShows = function($scope, url){
        $http.get(url).success(function(res){
            if (res.success){
                $scope.shows = res.shows;
                for (var i=0; i<$scope.shows.length; i++){
                    $scope.shows[i].when = new Date($scope.shows[i].when);
                    $scope.shows[i].timeString = ('00'+$scope.shows[i].when.getHours()).substr(-2)+':'+
                                                 ('00'+$scope.shows[i].when.getMinutes()).substr(-2);
                    $scope.shows[i].dateString = $scope.weekLookup[$scope.shows[i].when.getDay()] + ', ' +$scope.shows[i].when.getDate()+'/'+($scope.shows[i].when.getMonth()+1)+'/'+$scope.shows[i].when.getFullYear();
                }
                $scope.error = null;
            }
            else{
                $scope.error = "Website error.";
            }
        })
        .error(function(){
            $scope.error = "Network connection error.";
        });
    }

    model.addShow = function($scope, url){

        var formData = $.extend(true, {}, $scope.newShow);
        formData.when = moment(formData.when, 'DD/MM/YYYY - HH:mm')._d.toJSON();

        $http.post(url, formData).success(function(res){
            if (res.success){
                $scope.broadcast();
                $(".modal").modal('hide');
            }
            else{
                $scope.error = "Failed to add new show.";
            }
        }).error(function(){
            $scope.error = "Network connection error.";
        });
    }

    model.deleteShow = function($scope, url){
        $http.post(url, $scope.activeShow).success(function(res){
            if (res.success){
                var index = $scope.shows.indexOf($scope.activeShow);
                if(index > -1){
                    $scope.shows.splice(index, 1);
                    $scope.activeShow = null;
                    if ($scope.firstShown >= $scope.shows.length){
                        $scope.showEarlier();
                    }
                }
            }
            else{
                $scope.error = "Failed to remove show.";
            }
        }).error(function(){
            $scope.error = "Network connection error.";
        });
    }

    model.updateImage = function($scope, url){
        var image = document.getElementById('showImage').files[0];
        var reader = new FileReader();
        $scope.imageLoading = true;
        reader.onloadend = function(e){
            var upload = e.target.result;
            var formData = {
                image: upload,
                show: $scope.activeShow
            };
            $http.post(url, formData).success(function(res){
                $scope.imageLoading = false;
                if (res.success){
                    var show = res.show
                    show.when = new Date(show.when);
                    show.timeString = ('00'+show.when.getHours()).substr(-2)+':'+
                                      ('00'+show.when.getMinutes()).substr(-2);
                    show.dateString = show.when.getDate()+'/'+(show.when.getMonth()+1)+'/'+show.when.getFullYear();
                    var index = $scope.shows.indexOf($scope.activeShow);
                    if (index >= 0){
                        $scope.shows[index] = show;
                        $scope.activeShow = show;
                    }
                }
            }).error(function(){
                $scope.error = "Network connection error.";
                $scope.imageLoading = false;
            });
        }
        reader.readAsDataURL(image);
    }

    return model;

};
