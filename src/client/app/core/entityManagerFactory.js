(function() {
    'use strict';
    
    var serviceId = 'entityManagerFactory';
	
	angular
      	.module('app.core')
      	.factory(serviceId, emFactory);
          
    	emFactory.$inject = [
      	     'breeze',
             'config'
    ];

    function emFactory(breeze, config) {
		
		 // Convert server-side PascalCase to client-side camelCase property names
        breeze.NamingConvention.camelCase.setAsDefault();
        // Do not validate when we attach a newly created entity to an EntityManager.
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();
       
        //var serviceRoot = window.location.protocol + '//' + window.location.host + '/';
        var serviceRoot = config.remoteServerName;
		var serviceName = serviceRoot + config.remoteServiceName;
        var metadataStore = new breeze.MetadataStore();

        var service = {
            metadataStore: metadataStore,
            newManager: newManager
        };
        return service;

        function newManager() {
            var mgr = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
            return mgr;
        }
    }
})();