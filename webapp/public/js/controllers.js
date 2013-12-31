'use strict';

/* Controllers */

angular.module('zoggle.controllers', []).
controller('MainCtrl', ['$scope',
  function ($scope) {
    $scope.words = []
    $scope.board = []
    $scope.timeStart = 0
    $scope.timeEnd = 0
    $scope.timeNext = 0
    $scope.time = 0
    $scope.players = []
    $scope.won = []
    $scope.input = {
      word: ''
    }
    $scope.gameOver = false
    $scope.score = 0
    $scope.setName = false
    $scope.isMobile = true
    var socket = io.connect();
    socket.on('game', function (GAME) {
      console.log('game', GAME)
      $scope.gameOver = false
      for (var key in GAME) {
        $scope[key] = GAME[key]
      }
      $scope.words = []
    })
    socket.on('name', function (name) {
      if (!$scope.name) {
        $scope.name = name
      }
    })
    socket.on('won', function (winningWords) {
      console.log('words', winningWords)
      $scope.won = winningWords
    })
    socket.on('players', function (players) {
      console.log('players', players)
      $scope.$apply(function () {
        $scope.players = players
      })
    })
    socket.on('word', function (word, score) {
      $scope.words.unshift(word)
      $scope.score = score
    })
    $scope.name = localStorage.name
    if ($scope.name) {
      socket.emit('name', $scope.name)
    }
    $scope.guess = function () {
      console.log('word', $scope.input.word)
      socket.emit('word', $scope.input.word)
      $scope.input.word = ''
    }
    $scope.editName = function() {
      $scope.setName = true
    }
    $scope.commitName = function() {
      localStorage.name = $scope.name
      socket.emit('name', $scope.name)
      $scope.setName = false
    }
    $scope.share = function() {
      try{
        stWidget.shareables[0].popup()
      } catch(e) {
        console.log('error opening share popup', e.stack)
      }
    }
    function zeroPad(number) {
      return number < 10 ? '0' + number : number
    }

    function timer() {
      setTimeout(timer, 53)
      $scope.$apply(function () {
        $scope.time += 53
        var time = $scope.timeEnd - $scope.time
        if(time < 0) {
          time = $scope.timeNext - $scope.time
          $scope.gameOver = true
        } else {
          $scope.gameOVer = false
        }
        var ms = zeroPad(Math.floor(time % 1000 / 10))
        time /= 1000
        var sec = zeroPad(Math.floor(time % 60))
        time /= 60
        var min = zeroPad(Math.floor(time % 60))
        $scope.timer = ($scope.gameOver ? 'Next game in: ' : '') + min + ':' + sec + ':' + ms
      })
    }
    setTimeout(timer, 53)
  }])