define(['angular'], function(angular) {
    describe('ng:repeat', function() {
        it("should fire the create event for every entry when the list grows", function() {
            var element = angular.element('<div><div ng:repeat="l in list"></div></div>');
            var scope = angular.compile(element)();
            var createCount = 0;
            element.bind('create', function() {
                createCount++;
            });
            scope.list = [0,1];
            scope.$eval();
            expect(createCount).toEqual(2);
        });

        it("should not fire the create event until the end of the eval cycle so double nested lists should work fine", function() {
            var element = angular.element('<div><div ng:repeat="l in list"><ul><li ng:repeat="l2 in list2"></li></ul></div></div>');
            var scope = angular.compile(element)();
            var createCount = 0;
            var list2CountOnCreate;
            element.bind('create', function() {
                createCount++;
                list2CountOnCreate = element.find('li').length;
            });
            scope.list = [0,1];
            scope.list2 = [10,11];
            scope.$eval();
            expect(list2CountOnCreate).toEqual(4);
        });


        it("should fire the remove event for every entry when the list shrinks", function() {
            var element = angular.element('<div><div ng:repeat="l in list"></div></div>');
            var scope = angular.compile(element)();
            scope.list = [0,1];
            scope.$eval();
            var removeCount = 0;
            element.children('div').bind('remove', function() {
                removeCount++;
            });
            scope.list = [];
            scope.$eval();
            expect(removeCount).toEqual(2);
        });

        it('should append new elements at the same level even when they wrap themselves in new parents', function() {
            var element = angular.element('<div><button ng:repeat="l in list"></button></div>');
            $("body").append(element);
            try {
                var scope = angular.scope();
                scope.list = [1];
                angular.compile(element)(scope);
                element.trigger('create');
                // Button should add a parent
                expect(element.children('div').length).toBe(1);
                scope.list = [1,2];
                scope.$eval();
                expect(element.children('div').length).toBe(2);
            } finally {
                element.remove();
            }
        });
    });
});
