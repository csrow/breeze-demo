(function () {
    'use strict';

    angular
        .module('page.items')
        .controller('ItemsController', ItemsController);

    ItemsController.$inject = ['$q', 'datacontext', 'logger', '$state'];
    /* @ngInject */
    function ItemsController($q, datacontext, logger, $state) {
        var vm = this;
        vm.news = {
            title: 'Dry Cleaning Service Items',
            description: 'Items maintenance screen'
        };
        vm.title = 'Items';
        
        vm.items = [];
        vm.itemWithCount = [];
        vm.itemsArraySize = 0;
        vm.newItem = {};
        vm.editItem = {};
        vm.inEdit = false;
        vm.inEditItem = {};

        vm.addNew = addNew;
        /*vm.delete = deleteOne;
        vm.startEdit = startEdit;
        vm.cancelEdit = cancelEdit;
        vm.saveEdit = saveEdit;*/

        vm.config = {
            itemsPerPage: 10,
            fillLastPage: true
        };
        
        activate();

       function activate() {
            var promises = [getItems()];
            return $q.all(promises).then(function() {
                logger.info('Activated Items View');
            });
        }
        
        function addNew() { 
            $state.go('items.add')
            return;
        }
        
        function getItems() {
            return datacontext.getItems()
            .then(function (data) {
                vm.items = data;
                vm.itemWithCount = vm.items;
                vm.itemsArraySize = vm.items.length;
                return getCounts();
            });
        }
        
        function getCounts() {
            var fieldId = 'itemID';
            var index;
            vm.items.forEach(function (item, eIndex) {
                index = item.itemID;
                getCount(fieldId, index, eIndex)
                .then(function (data) {
                    vm.itemWithCount[eIndex].count = data;
                });
            })
        }
        
        function getCount(fieldId, index, eIndex) {
            return datacontext.getDetailsItemCount(fieldId, index)
            .then(function (data) {
                return data;
            });
        }
    }
})();