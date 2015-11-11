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
    
      var entityQuery = breeze.EntityQuery;
      var manager = emFactory.newManager();
    
      var localsValid = {
        customer: false,
        item: false,
        order: false,
        detail: false  
      };
 
      var service = {
        getInit: getInit,
        getItems: getItems,
        getDetailsItemCount: getDetailsItemCount
      };

      return service;
    
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
      
      function _getLocal(query) {
        return manager.executeQueryLocally(query);
      }
      
      function _fail(e){
        //logger.error('Retrival failed', e, 'Lookups'); 
        return exception.catcher('Retrival failed')(e); 
      }
    }
})();