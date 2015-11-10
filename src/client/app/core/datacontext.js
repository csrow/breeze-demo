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
        getInit: getInit
    };

    return service;
    
    function getInit() {
      return entityQuery.from('Lookups')
      .using(manager)
      .execute()
      .then(querySucceeded)
      .catch(queryFailed);

      function querySucceeded(data) {
        localsValid.customer = true;
        localsValid.item = true;
        localsValid.order = true;
        localsValid.detail= true;
        logger.success('Retrieved Initial data', data, 'Lookups');
        return true;
      }
      
      function queryFailed(e){
        logger.error('Retrival failed', e, 'Lookups');  
      }
    }
  }
})();