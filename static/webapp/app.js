var feedApp = angular.module("feedApp", [
    "ngRoute",
    "baseServices"
]);

feedApp.config(function($routeProvider, $sceDelegateProvider) {
    $routeProvider
        .when('/feed', {
                templateUrl: 'feed_template.html',
                controller: 'FeedController'
        })
        .when('/item/:itemId', {
                templateUrl: 'item_template.html',
                controller: 'ItemController'
        })
        .otherwise({redirectTo: '/feed'});
        
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self'
  ]);
});

feedApp.directive("singleItem", function() {
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: './single_item_template.html',
        controller: singleItemController
    };
});

feedApp.directive("commentsForm", function() {
    return {
        restrict: 'EA',
        scope: false,
        templateUrl: './comments_form_template.html',
        controller: commentController
    };
})

function singleItemController($scope, $location, serverService) {
    $scope.getPersonName = id => $scope.people.find(person => person.id == id).name
    $scope.seeItem = id => $location.path('/item/' + id);
}

function commentController($scope, serverService) {
    $scope.c = {};
    $scope.postComment = (item_id) => {
        serverService.makePostRequest("http://localhost:8080/item/add_comment", {id: item_id, author_id: "author_1", text: $scope.c.text})
            .success((data) => {
                console.log(data);
                $scope.item.comments.push({comment: $scope.c.text, author_id: "author_1"});
                $scope.commentForm.$setPristine();
                $scope.c = {};
            })
    };
}

feedApp.controller("FeedController",
    ["$scope", "serverService",
    function($scope, serverService) {
        serverService.makeGetRequest("http://localhost:8080/feed", {})
            .success( (data) => {
                $scope.items = data.items;
                $scope.people = data.people;
            })
    }
]);

feedApp.controller("ItemController",
    ["$scope", "$routeParams", "serverService",
    function($scope, $routeParams, serverService) {
        serverService.makePostRequest("http://localhost:8080/item", {id: $routeParams.itemId})
            .success((data) => {
                $scope.item = data.item;
                $scope.people = data.people;
            })
    }
]);