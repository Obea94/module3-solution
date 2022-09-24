(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm = "";
  menu.errorMessage = "";
  menu.foundItems = [];

  menu.found = function() {
    menu.errorMessage = "";
    menu.foundItems = [];
    if(menu.searchTerm == "") {
      menu.errorMessage = "Nothing found";
	  } else {
		  var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
      promise.then(function(result) {
        menu.foundItems = result;
        if (menu.foundItems.length == 0)
          menu.errorMessage = "Nothing found";
      }).catch(function(error) {
        console.log(error);
      });
		}
	};

  menu.removeItem = function(index) {
    menu.foundItems.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (result){
      // process result and only keep items that match
      var foundItems = [];
      var items = result.data.menu_items
      for (var i = 0; i < result.data.menu_items.length; i++) {
        if (items[i].description.toUpperCase().indexOf(searchTerm.toUpperCase()) != -1) {
          foundItems.push(result.data.menu_items[i]);
        }
      }
      // return processed items
      return foundItems;
    }).catch(function(error) {
      console.log(error);
    })
  };
}

})();
