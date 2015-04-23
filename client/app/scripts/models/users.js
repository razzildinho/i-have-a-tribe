/**
 * @ngInject
 */
var userModel = function($http){

    var model = {};

    model.logIn = function($scope, url){
        $http.post(url, $scope.logInForm).success(function(res){
            $scope.logInForm = {
                email: '',
                password: ''
            };
            if (res.success){
                $scope.user = res.user;
                $scope.userError = null;
                window.sessionStorage.token = res.token;
                $scope.closeModal();
            }
            else{
                $scope.userError = "Log in error.";
                delete window.sessionStorage.token;
            }
        })
        .error(function(){
            $scope.userError = "Network connection error.";
        });
    }

    model.logOut = function($scope){
        $scope.user = null;
        delete window.sessionStorage.token;
    }

    model.checkUser = function($scope, url){
        if (window.sessionStorage.token){
            $http.get(url).success(function(res){
                if (res.user){
                    $scope.user = res.user;
                }
                else{
                    $scope.user = null;
                }
            }).error(function(){
                $scope.user = null;
                $scope.userError = "Network connection error.";
            });
        }
        else{
            $scope.user = null;
        }
    }

    return model;

};
