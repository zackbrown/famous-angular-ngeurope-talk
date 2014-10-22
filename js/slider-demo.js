var module = angular.module('slider-demo', ['famous.angular']);

//This is pretty hacky code.
//Was built just to demo a point (expressiveness of imperative animations)
module.controller('SliderCtrl', function($scope, $famous, $timeout, $timeline){
  var Transitionable = $famous['famous/transitions/Transitionable'];
  var Transform = $famous['famous/core/Transform'];
  var Easing = $famous['famous/transitions/Easing'];
  var EventHandler = $famous['famous/core/EventHandler'];

  $scope.scrollHandler = new EventHandler();  

  $scope.getContainerWidth = function(){
    var app = document.querySelector('#slider-app');
    if(app){
      return app.clientWidth;
    }
    return 0;
  }

  var t = new Transitionable(0);

  var _draggable = undefined;
  var _position = [100,0,0];
  $scope.getDragPosition = function(){
    var find = $famous.find('#draggable');
    if(_draggable || (find && find[0] && find[0].modifier)){
      _draggable = _draggable || find[0].modifier;
      return _draggable.getPosition();
    }else{
      return _position;
    }
  };

  var COLORS = ["#b58900","#cb4b16","#dc322f","#d33682","#6c71c4","#268bd2","#2aa198","#859900"]

  $scope.bars = [
    1,2,3,4,5,6,7,8
  ];

  $scope.getTextOpacity = function(){
    return Easing.inQuad(t.get());
  }

  $scope.getArrowRotate = function(){
    return t.get() * Math.PI;
  };

  $scope.getArrowOpacity = function(){
    return 1-Easing.outQuad(t.get());
  };

  $scope.getPullOpacity = function(){
    return 1 - Easing.outQuint(t.get());
  };

  $scope.getTranslate = function(bar, index){
    var x = $scope.getSize()[0] * index;
    return [x, 0, 5];
  };

  $scope.getScale = function(bar, index){

    var startDomain = (index) / $scope.bars.length

    return $timeline([
      [0, [1, 0, 1]],
      [startDomain, [1, 0, 1], Easing.inQuad],
      [1, [1, 1, 1]]
    ])(t.get());
  };

  var _size = [undefined, undefined];
  $scope.getSize = function(bar){
    var width = $scope.getContainerWidth() / $scope.bars.length;

    return [width, undefined];
  };

  $scope.getOrigin = function(index){
    return [0, index&1 ? 0 : 1];
  }

  $scope.getBackgroundColor = function(bar, index){
    return COLORS[index]
  };

  //HACK should use a directive
  $timeout(function(){
    _draggable.sync.on('end', function(){
      var rest = [0,0];
      var tRest = 0;
      var transition = {duration: 750, curve: Easing.outBounce};
      if(_draggable._positionState.get()[0] > $scope.getContainerWidth() / 2){
        rest = [$scope.getContainerWidth() - 10, 0];
        tRest = 1;
      }
      _draggable._positionState.set(rest, transition);
      t.set(tRest, transition);
    });

    _draggable.sync.on('update', function(){
      var percent = _draggable._positionState.get()[0] / $scope.getContainerWidth();
      t.set(percent);
    });
  }, 333);



});