(function() {
    'use strict';

    angular
        .module('page.items')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'items',
                config: {
                    url: '/items',
                    templateUrl: 'app/pageItems/items.html',
                    controller: 'ItemsController',
                    controllerAs: 'vm',
                    title: 'Items',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-filw-text-o"></i> Items'
                    }
                }
            }
        ];
    }
})();
