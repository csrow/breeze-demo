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
                        nav: 2,
                        content: '<i class="fa fa-file-text-o"></i> Items'
                    }
                }
            },
            {
                state: 'items.add',
                config: {
                    url: '/add',
                    templateUrl: 'app/pageItems/items.add.html',
                    title: 'Items Add',
                }
            },
            {
                state: 'items.edit',
                config: {
                    url: '/edit',
                    templateUrl: 'app/pageItems/items.edit.html',
                    title: 'Items Edit',
                }
            }
        ];
    }
})();
