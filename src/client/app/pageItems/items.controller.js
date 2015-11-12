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
        var goRemote = true;
        vm.title = 'Items';
        
        vm.items = [];
        vm.itemsArraySize = 0;
        vm.newItem = {};
        vm.editItem = {};
        vm.inEdit = false;
        vm.inEditItem = {};

        vm.addNew = addNew;
        vm.saveAdd = saveAdd;
        vm.cancelAdd = cancelAdd;
        vm.delete = deleteOne;
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
            $state.go('items.add');
        }
        
        function saveAdd() {
            return datacontext.addNewItem(vm.newItem)
                .then(function(){
                    logger.success("New Item Added","","Item Add");
                   cancelAdd();
                });
        }
        
        function cancelAdd() {
            vm.newItem = {};
            $state.go('items','',{reload:true});
        }
        
        function deleteOne(item) {
            var check = confirm("Delete " + item.name + " ?");
            if (!check) { return };
            datacontext.deleteItem(item)
                .then(getItems()
                    .then(function () {
                        logger.success('Item deleted.',"","Delete Item");
                    })
                );
        }
        
        function getItems(go) {
            return datacontext.getItems(go)
            .then(function (data) {
                vm.items = data;
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
                    vm.items[eIndex].count = data;
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