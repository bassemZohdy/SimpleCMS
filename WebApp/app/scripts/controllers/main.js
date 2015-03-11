'use strict';

/**
 * @ngdoc function
 * @name webAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webAppApp
 */
angular.module('webAppApp')
    .controller('MainCtrl', function ($scope, $location, $modal, Content) {
        $scope.pageSize = 10;
        $scope.currentPage = 1;
        $scope.pageStart = 0;
        Content.count(function (count) {
            $scope.count = count.count;
        });
        $scope.selectContent = function (content) {
            if ($scope.selected && $scope.selected._id === content._id) {
                $scope.viewContent(content._id);
            } else {
                $scope.selected = content;
            }
        };
        //        $scope.isSelected = function (content) {
        //            return $scope.selected === contnet;
        //        };
        $scope.viewContent = function (id) {
            $location.path('/contnet/view/' + id);
        };
        $scope.contents = Content.query({
            start: $scope.pageStart,
            limit: $scope.pageSize,
            sort: '-created'
        });
        $scope.pageChanged = function () {
            $scope.pageStart = ($scope.currentPage - 1) * 10;
            $scope.contents = Content.query({
                start: $scope.pageStart,
                limit: $scope.pageSize,
                tags: $scope.t,
                q: $scope.q,
                sort: '-created'
            });
        };
        $scope.newContent = function () {
            $location.path('/contnet/edit');
        };
        $scope.q = '';
        $scope.t = '';
        $scope.openQ = function () {
            var qModal = $modal.open({
                templateUrl: 'views/searchQ.html',
                controller: 'SearchQCtrl',
                resolve: {
                    q: function () {
                        return $scope.q;
                    }
                }
            });
            qModal.result.then(function (q) {
                $scope.q = q;
                $scope.pageChanged();
            });
        };



        $scope.openT = function () {
            var tModal = $modal.open({
                templateUrl: 'views/searchT.html',
                controller: 'SearchTCtrl',
                resolve: {
                    t: function () {
                        return $scope.t;
                    }
                }
            });
            tModal.result.then(function (t) {
                $scope.t = t;
                $scope.pageChanged();
            });
        };
    });



angular.module('webAppApp')
    .controller('SearchQCtrl', function ($scope, $modalInstance, q) {
        $scope.search = {};
        $scope.search.q = q;
        $scope.ok = function () {
            $modalInstance.close($scope.search.q);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });


angular.module('webAppApp')
    .controller('SearchTCtrl', function ($scope, $modalInstance, t, Tag) {
        $scope.search = {};
        $scope.search.t = t;
        $scope.ok = function () {
            $modalInstance.close($scope.search.t);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.tags = Tag.query(function () {
            angular.forEach($scope.tags, function (tag) {
                console.log(tag);
                $scope.tagsString.push(tag.name);
            });
        });
        $scope.tagsString = [];
        $scope.select2Options = {
            'allowClear': true,
            'multiple': true,
            'simple_tags': true,
            'placeholder': 'Write tags of this Content',
            'tags': $scope.tagsString
        };
    });