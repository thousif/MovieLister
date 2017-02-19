	 window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
         
         //prefixes of window.IDB objects
	 window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	 window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
	 
	 if (!window.indexedDB) {
	    window.alert("Your browser doesn't support a stable version of IndexedDB.")
	 }

	 var db;
	 var request = window.indexedDB.open("Database", 6);
	 
	 request.onerror = function(event) {
	    console.log("error: ",event);
	 };
	 
	 request.onsuccess = function(event) {
	    db = event.target.result;
	 };
	
	 request.onupgradeneeded = function(event) {
        console.log("upgrading");
        var db = event.target.result;
        db.deleteObjectStore("movies");
        var objectStore = db.createObjectStore("movies", {keyPath:"id"});

        request.onsuccess = function(event){
        	console.log("created successfully");
        }

        request.onerror = function(event){
        	console.log("error creating");
        }
        
     }
	
	function add(data) {
	   console.log(data);
	   // var request = db.transaction(["movies"], "readwrite")
	   // .objectStore("movies")
	   // .add(data);

	   var request = db.transaction(["movies"], "readwrite");
	   
	   var objectStore = request.objectStore("movies");
		
		var request = objectStore.add(data);
		 
	   request.onsuccess = function(event) {
	   	  console.log("data added");
	   	  getAll();
	   };
	   
	   request.onerror = function(event) {
	      console.log("Unable to add data");
	   }
	}
	
	function get(id){
		var transaction = db.transaction(["movies"]);
		var objectStore = transaction.objectStore("movies");
		var request = objectStore.get(id+'');

		request.onerror = function(event){
			console.log("error");
		}

		request.onsuccess = function(event){
			console.log("success",request);
		}
	}

	function getAll(){
		var objectStore = db.transaction("movies").objectStore("movies");

		console.log(objectStore);
		console.log("getting all");

		objectStore.openCursor().onsuccess = function(event){

			var cursor = event.target.result;

			if(cursor){
				console.log(cursor.id,cursor.country);
			} else {
				console.log("no more entries");
			}
		}

		objectStore.openCursor().onerror = function(event){
			console.log("error",event);
		}
	}

	return{
		add : add,
		getAll : getAll,
		get    : get
	}