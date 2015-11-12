(function () {
    'use strict';

    angular
        .module('page.items')
        .controller('ItemsController', ItemsController);

    ItemsController.$inject = ['$q', 'datacontext', 'logger', '$state', '$scope', '$location'];
    /* @ngInject */
    function ItemsController($q, datacontext, logger, $state, $scope, $location) {
        var vm = this;
        vm.news = {
            title: 'Dry Cleaning Service Items',
            description: 'Items maintenance screen'
        };
        vm.title = 'Items';
        
//- variables ----------------------------------------------------        
        vm.items = [];
        vm.itemsArraySize = 0;
        vm.newItem = {};
        vm.editItem = {};
        vm.inEdit = false;
        vm.inEditItem = {};
        
//- functions names ---------------------------------------------
        vm.addNew = addNew;
        vm.saveAdd = saveAdd;
        vm.cancelNow = cancelNow;
        vm.delete = deleteOne;
        vm.startEdit = startEdit;
        vm.saveEdit = saveEdit;
        
//- angular table config ------------------------------
        vm.config = {
            itemsPerPage: 10,
            fillLastPage: true
        };
        
//- start ---------------------------------------------        
        activate();

       function activate() {
            var promises = [getItems()];
            return $q.all(promises).then(function() {
                logger.info('Activated Items View');
            });
        }
  
  //- end ---------------------------------------------
  // Problem - this is getting called on all location changes.
 /*       $scope.$on("$locationChangeStart", function (event) {
            if (datacontext.noPendingChanges()){return;}
            if (!confirm('Discard any pending changes and Leave?')) {
                event.preventDefault();
                return;
            }
            datacontext.cancelChanges();
        });      */
 //------------------------------------------------------------       
        function startEdit(item) {
            $state.go('items.edit');
            vm.editItem = item;
            vm.inEditItem.description = item.description;
            vm.inEditItem.price = item.price;
            vm.inEdit = true;    
        }        
 //------------------------------------------------------------  
        function saveEdit() {
            vm.editItem.description = vm.inEditItem.description;
            vm.editItem.price = vm.inEditItem.price;
            datacontext.saveChanges()
                .then(cancelNow());
        }     
 //------------------------------------------------------------       
        function addNew() {
            $state.go('items.add');
        }
//------------------------------------------------------------              
        function saveAdd() {
            checkItemDuplicate(vm.newItem.name)
                .then (function(duplicate) {
                    if (duplicate) {
                        alert ('Item ' + vm.newItem.name + 'already in the system.');
                        return;    
                    }
                    datacontext.addNewItem(vm.newItem)
                        .then(function(){
                            logger.success("New Item Added","","Item Add");
                            cancelNow();
                        });
                    });
        }
 //------------------------------------------------------------               
        function cancelNow() {
            $state.go('items','',{reload:true});
        }
 //------------------------------------------------------------               
        function deleteOne(item) {
            var check = confirm("Delete " + item.name + " ?");
            if (!check) { return; }
            datacontext.deleteItem(item)
                .then(getItems()
                    .then(function () {
                        logger.success('Item deleted.',"","Delete Item");
                    })
                );
        }
 //------------------------------------------------------------               
        function getItems() {
            return datacontext.getItems()
            .then(function (data) {
                vm.items = data;
                vm.itemsArraySize = vm.items.length;
                return getCounts();
            });
        }
 //------------------------------------------------------------               
        function getCounts() {
            var fieldId = 'itemID';
            var index;
            vm.items.forEach(function (item, eIndex) {
                index = item.itemID;
                getCount(fieldId, index, eIndex)
                .then(function (data) {
                    vm.items[eIndex].count = data;
                });
            });
        }
 //------------------------------------------------------------               
        function getCount(fieldId, index, eIndex) {
            return datacontext.getDetailsItemCount(fieldId, index)
            .then(function (data) {
                return data;
            });
        }
 //------------------------------------------------------------               
        function checkItemDuplicate(name) {
            return datacontext.checkItemDuplicate(name);    
        }
    }
})();