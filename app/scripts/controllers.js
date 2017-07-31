'use strict';

angular.module('confusionApp')

.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {
  $scope.tab = 'all';
  $scope.filtText = '';

  $scope.showMenu = false;
  $scope.message = "Loading ...";
  menuFactory.getDishes().query(
  function(response) {
      $scope.dishes = response;
      $scope.showMenu = true;
  },
  function(response) {
      $scope.message = "Error: "+response.status + " " + response.statusText;
  });

  $scope.select = function(setTab) {
    $scope.tab = setTab;

    if (setTab === 'appetizers') {
      $scope.filtText = "appetizer";
    }
    else if (setTab === 'mains') {
      $scope.filtText = "mains";
    }
    else if (setTab === 'desserts') {
      $scope.filtText = "dessert";
    }
    else {
      $scope.filtText = "";
    }
  };

  $scope.isSelected = function (checkTab) {
    return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
    $scope.showDetails = !$scope.showDetails;
  };

}])

.controller('ContactController', ['$scope', function($scope) {
  $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
  var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
  $scope.channels = channels;
  $scope.invalidChannelSelection = false;
}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {

  $scope.sendFeedback = function() {
    if ($scope.feedback.agree && ($scope.feedback.mychannel === "")&& !$scope.feedback.mychannel) {
      $scope.invalidChannelSelection = true;
    }
    else {
        $scope.invalidChannelSelection = false;

        feedbackFactory.getFeedback().save({
                        firstName:$scope.feedback.firstName,
                        lastName:$scope.feedback.lastName,
                        tel: {
                                areaCode:$scope.feedback.tel.areaCode,
                                number:$scope.feedback.tel.number
                             },
                        email:$scope.feedback.email,
                        agree:$scope.feedback.agree,
                        mychannel:$scope.feedback.mychannel,
                        comments:$scope.feedback.comments
                      });

        $scope.feedback.firstName = "";
        $scope.feedback.lastName = "";
        $scope.feedback.tel.areaCode = "";
        $scope.feedback.tel.number = "";
        $scope.feedback.email = "";
        $scope.feedback.agree = false;
        $scope.feedback.mychannel = "";
        $scope.feedback.comments = "";

        $scope.feedbackForm.$setPristine();
        console.dir($scope.feedback);

    }
  };

}])

.controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

  $scope.showDish = false;
  $scope.message="Loading ...";
  $scope.dish = menuFactory.getDishes().get({id:parseInt($stateParams.id,10)})
  .$promise.then(
    function(response){
        $scope.dish = response;
        $scope.showDish = true;
    },
    function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
    }
  );

}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {

  var date = new Date().toISOString();
  $scope.comments = {rating: 5, comment:"", author:"", date: date};

  $scope.submitComment = function () {

      $scope.dish.comments.push($scope.comments);
      menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
      $scope.commentForm.$setPristine();
      $scope.comments = {rating: 5, text:"", author:"", date: date};

  };

}])

.controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function($scope, menuFactory, corporateFactory) {

  $scope.showDish = false;
  $scope.showPromotion = false;
  $scope.showLeader = false;
  $scope.message="Loading ...";

  menuFactory.getDishes().get({id:0})
  .$promise.then(
      function(response){
          $scope.dish = response;
          $scope.showDish = true;
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

  menuFactory.getPromotions().get({id:0})
  .$promise.then(
      function(response){
          $scope.promotion = response;
          $scope.showPromotion = true;
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

  corporateFactory.getLeaders().get({id:3})
  .$promise.then(
      function(response){
          $scope.leader = response;
          $scope.showLeader = true;
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
      }
  );

}])

.controller('AboutController', ['$scope', 'corporateFactory', function($scope, corporateFactory) {

  $scope.showLeaders = false;
  $scope.message = "Loading ...";
  corporateFactory.getLeaders().query(
    function(response) {
        $scope.leaders = response;
        $scope.showLeaders = true;
    },
    function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
    }
  );

}]);
