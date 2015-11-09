(function () {
    'use strict';

    angular
        .module('page.items')
        .controller('ItemsController', ItemsController);

    ItemsController.$inject = ['$q', 'datacontext', 'logger'];
    /* @ngInject */
    function ItemsController($q, datacontext, logger) {
        var vm = this;
        vm.news = {
            title: 'Items',
            description: 'Items maintenance screen'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'Items';
        
        activate();

       function activate() {
            logger.info('Activated Items View');
        }
    }
})();