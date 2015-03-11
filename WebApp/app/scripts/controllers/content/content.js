'use strict';
/**
 * Created by bzohdy on 9/3/14.
 */

angular.module('webAppApp')
    .controller('ContnetEditCtrl', function ($scope,$routeParams,$location,Content,Tag) {
        console.log('start of Edit Content')
        $scope.id = ($routeParams.id)?$routeParams.id:null;
        $scope.tags = Tag.query(function(){
            angular.forEach($scope.tags,function(tag){console.log(tag);$scope.tagsString.push(tag.name)});
        });
        $scope.tagsString =[];
        $scope.select2Options = {
            'allowClear':true,
            'multiple': true,
            'simple_tags': true,
            'placeholder': 'Write tags of this Content',
            'tags': $scope.tagsString
        };
        if($scope.id == null) {
            $scope.new = true
            $scope.content = new Content();
            $scope.content.status = 'draft'
            $scope.saveContent = function (content) {
                content.$save(function(){
                    $location.path( '/');
                });
            };
        }else{
            $scope.content = Content.get({id:$routeParams.id});
            $scope.saveContent = function (content) {
                Content.update(content,function(){
                    $location.path( '/contnet/view/'+content._id );
                });
            };
        }
        $scope.resetContent=function(){
            if($scope.id)
                $scope.content = Content.get({id:$scope.id});
            else
                $scope.content = new Content();

        }
        $scope.deleteContent=function(c){
            c.$delete();
            $location.path( '/' );
        }

    })
    .controller('ContnetViewCtrl', function ($scope,$location,$routeParams,Content) {
        console.log('start of view Content')
        $scope.id = ($routeParams.id)?$routeParams.id:null;
        $scope.mode='view';
        $scope.$watch('mode',function(newValue,oldValue){
            if(newValue === 'edit')
                $location.path( '/contnet/edit/'+$scope.id );
        });
        $scope.modes=['view','inline','edit'];
        if($scope.id == null) {
            $scope.new = true
            $scope.content = new Content();
            $scope.content.status = 'draft'
            $scope.saveContent = function (content) {
                content.$save();
            };
        }else{
            $scope.content = Content.get({id:$routeParams.id});
            $scope.saveContent = function (content) {
                Content.update(content);
                $location.path( '/contnet/view/'+content._id );
                $scope.mode='view';
            };
        }
        $scope.selectMode=function(m){
            $scope.mode= m
        }

    });