'use strict';

/**
 * @ngInject
 */
var MainCtrl = function($window, $rootScope, userModel, globalModel){

    this.user = null;

    this.logInForm = {
        email: '',
        password: ''
    };

    this.newUser = {
        email: '',
        password: ''
    };

    this.serverUrl = globalModel.serverUrl;

    this.userError = null;

    this.login = function(){
        userModel.logIn(this, globalModel.serverUrl+'user/session');
    };

    this.logout = function(){
        userModel.logOut(this);
    };
    
    this.addUser = function(){
        userModel.addUser(this, globalModel.serverUrl+'user/user');
    };

    userModel.checkUser(this, globalModel.serverUrl+'user/status');
    
    this.closeModal = function(){
        $(".modal").modal('hide');
    }
    
};
