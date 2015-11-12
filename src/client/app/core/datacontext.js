(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('datacontext', datacontext);

    //datacontext.$inject = ['$http', '$q', 'exception', 'logger'];
    datacontext.$inject = [
        'breeze',
        '$q',
        'exception',
        'logger',
        'entityManagerFactory'
    ];
    /* @ngInject */
    function datacontext(breeze, $q, exception, logger,emFactory) {
        
 //- local variables ---------------------------------------------   
      var entityQuery = breeze.EntityQuery;
      var manager = emFactory.newManager();
    
      var localsValid = {
        customer: false,
        item: false,
        order: false,
        detail: false  
      };
      
 //- services ----------------------------------------------------
      var service = {
        getInit: getInit,
        getItems: getItems,
        getDetailsItemCount: getDetailsItemCount,
        addNewItem: addNewItem,
        deleteItem: deleteItem,
        saveChanges: saveChanges
      };
      return service;
      
 // -------------------------------------------------------------
      function getInit() {
        return entityQuery.from('Lookups')
          .using(manager)
          .execute()
          .then(querySucceeded)
          .catch(_fail);

        function querySucceeded(data) {
          localsValid.customer = true;
          localsValid.item = true;
          localsValid.order = true;
          localsValid.detail= true;
          logger.success('Retrieved Initial data', data, 'Lookups');
          return true;
        }
      }
      
      function getItems(goRemote) {
        var orderBy = 'name';
        var items;

        var query = new breeze.EntityQuery()
          .from('Items')
          .orderBy(orderBy);

        if (localsValid.item && !goRemote) {
          items = _getLocal(query);
          return $q.when(items);
        }
        return manager.executeQuery(query)
          .then(success)
          .catch(_fail);

        function success(data) {
          items = data.results;
          localsValid.item = true;
          logger.success("Items Fetched " + items.length, null, 'Items Get')
          return items;
        }
      }
      
      function getDetailsItemCount(id, index) {
        var count = 0;
        var query = new breeze.EntityQuery()
          .from('Details')
          .where(id, '==', index)
          .take(0).inlineCount()

        if (localsValid.detail) {
          var tempDetail = _getLocal(query);
          tempDetail.forEach(function (element) {
            if (element[id] == index) { count++ };
          })
          return $q.when(count);
        } else {
          return manager.executeQuery(query)
            .then(success)
            .catch(_fail);
        }
        function success(data) {
          count = data.inlineCount;
          return count;
        }
      }
      
      function addNewItem(newEntry){
        var newItem = manager.createEntity('Item');
        newItem.name = newEntry.name;
        newItem.description = newEntry.description;
        newItem.price = newEntry.price;
        return saveChanges();
      }
      
      function deleteItem(item) {
      if (item) {
        var aspect = item.entityAspect;
        aspect.setDeleted();
        return saveChanges();
      }
    }
      
    function saveChanges() {
      if (!manager.hasChanges()) {
          return $q.when({});
      }
      return manager.saveChanges()
        .then(saveSucceeded)
        .catch(saveFailed);

      function saveSucceeded(saveResult) {
          logger.success("Save Finished",saveResult.entities.length,"Save Operation");
          return $q.when(saveResult);
      }

      function saveFailed(error) {
        var reason = error.message;
        var detail = error.detail;

        if (error.entityErrors) {
             reason = reason + " Check on required fields.";
        } else if (detail && detail.ExceptionType &&
             detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
        // Concurrency error 
             reason =
                    "Another user, perhaps the server, " +
                    "may have deleted one or all of entities." +
                    " You may have to restart the app.";
        } else {
              reason = "Failed to save changes: " + reason +
                    " You may have to restart the app.";
        }
          logger.error(reason,"","Save Operation Error");
        return error;
      }
    }
 
 //- local functions --------------------------------------------     
      function _getLocal(query) {
        return manager.executeQueryLocally(query);
      }
      
      function _fail(e){
        //logger.error('Retrival failed', e, 'Lookups'); 
        return exception.catcher('Retrival failed')(e); 
      }
    }
})();