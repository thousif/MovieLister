var app = angular.module('app',['ui.router','ngRipple','indexedDB']);

app.config(function($stateProvider, $urlRouterProvider, $indexedDBProvider){
	$urlRouterProvider.otherwise('movies');

    $stateProvider
      .state('movies', {
        url:'/movies?page',
        templateUrl :'partials/start.html',
        controller:'mainCtrl'
      });

    $indexedDBProvider
      .connection('myIndexedDB')
      .upgradeDatabase(7, function(event, db, tx){
        var objStore = db.createObjectStore('movies', {keyPath: 'id'});
        objStore.createIndex('name_idx', 'name', {unique: false});
      });
});
    
app.run(['rippleConfig', function(rippleConfig){
    rippleConfig.rippleOpacity = .6;
    rippleConfig.rippleDelay = 100;
    rippleConfig.mobileTouch = false; // False (default): Mobile use ONLY click || True: mobile use touchstart and touchend
}]);

app.controller('mainCtrl',function($scope,$http,$stateParams,store,$indexedDB){

	$scope.getMovies = function(cb){
		$http({
			method : 'GET',
			url : 'http://starlord.hackerearth.com/simility/movieslisting',
		}).then(function successCallback(response){
			console.log(response);
			$scope.movies = response.data;
			cb();
		}, function errorCallback(response){
			console.log(response);
		});
	}

   $indexedDB.openStore('movies', function(store){

   		store.count().then(function(e){
   			$scope.count = e;
   		});

   		if($scope.count < 1){
   			$scope.getMovies(function(){
   				for(var i=0;i<$scope.movies.length;i++){
			  		var movie = $scope.movies[i];
			  		movie.id = i;
			  		store.insert(movie).then(function(e){
				      console.log("Added successfully");
				    },function(e){
				    	console.log("already exists");
				    }); 		
			   	}
			   	$scope.getMoviesFromDB();
   			});
   		} else {
   				$scope.getMoviesFromDB();
   		}

      // store.clear().then(function(){
      // 	console.log("cleared movies db");
      // });
    });

   	$scope.getMoviesFromDB = function(){
	   	$indexedDB.openStore('movies', function(store){
	   		store.getAll().then(function(movies) {  
				$scope.movies = movies;
				$scope.moviesToShow();
				console.log($scope.movies);
			});
	   	});
	}

	$scope.moviesToShow = function(){
		var index = $stateParams.page;
		var maxMoviesToShow = 10;

		$scope.moviesOnPage = [];

		for(var i=0;i<maxMoviesToShow;i++){
			$scope.moviesOnPage.push($scope.movies[index+i]);
		}

		console.log($scope.moviesOnPage);
	}
});

app.factory('store',function(){
	return {}
})

