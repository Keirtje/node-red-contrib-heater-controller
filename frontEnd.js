'use strict';
module.exports.init = function (config, currentCalTemp, nextCalTemp) {
    var conf = JSON.stringify(config);
    function getCSS() {
        return String.raw`<style>
            .iconFalse {
                color: gray;
            }
            .iconTrue {
                color: #ff4d4d;
            }
            .icon {
                margin: 0;
                margin-left: 10px;
                font-size:1em;
            }
            .userSettingsIcon {
                margin-right: 20px;
            }
            .targetTemp {
                color: #0094ce;
                font-size: 1em;
                font-weight: bold;
            }
            .heaterContr {
                margin-left: 10px;
            }
            .slider {
                margin-left: 10px;
                margin-right: 10px;
            }
            .temp {
                color: #0094ce;
                font-size: 4em;
                font-weight: bold;
            }
            .warning-icon i {
                margin-left: 5px;
                margin-right: 5px;
            }
            .no-select:focus {
                outline: none;
                cursor: pointer;
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none;
            }
            .user-mode {
                color: rgb(63,81,181);
            }
            </style>`;
    }
    function getHTML() {
        return String.raw`
        <div layout="column" flex layout-align="center stretch" ng-init='init(${conf}, ${currentCalTemp}, "${nextCalTemp}")'>
        <div layout="row" layout-align="end center" class="warning-icon">
                <span title="Current calendar temp"><i class="fa fa-calendar-o" aria-hidden="true"></i>{{msg.currentCalTarget || currentCalTemp}}</span>
                <span title="Next calendar temp"><i class="fa fa-calendar-plus-o" aria-hidden="true"></i>{{nextCalTemp}}</span>
                <i title="Calendar is missing" class="fa fa-calendar"  style="color:red" aria-hidden="true" ng-if="!config.calendar"></i>
                <i title="Current temperature is missing" class="fa fa-thermometer-empty"  style="color:red" aria-hidden="true" ng-if="!msg.currentTemp"></i>
            </div>
            <div layout="row" layout-align="center center" class="container">
                <div layout-align="end center" layout="column">
                    <div ng-class="{'user-mode': msg.isUserCustom}" class="temp no-select" md-swipe-left="toSchedule()" md-swipe-right="toSchedule()" ng-dblclick="toSchedule()">{{msg.targetValue | number:1}}&deg;C</div>
                </div>
                <div class='heaterContr' layout-align="center center" layout="column">
                    <div class="targetTemp" flex="50">{{msg.currentTemp | number:1}}</div>
                    <div layout-align="space-between" layout="row" flex="50">
                        <i class="fa fa-fire icon" ng-class="msg.currentHeaterStatus == 'on' ? 'iconTrue' : 'iconFalse'" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div layout-align="center stretch" layout="column">
                <md-slider ng-disabled='!msg.targetValue || !msg.currentTemp' ng-change="sendVal()" class="md-primary slider" md-discrete ng-model="msg.userTargetValue" step="${config.sliderStep}" min="${config.sliderMinValue}" max="${config.sliderMaxValue}">
            </div>
        </div>`;
    }

    function getController($scope, events) {
        $scope.init = function (conf, currentCalTemp, nextCalTemp) {
            $scope.config = conf;
            $scope.currentCalTemp = currentCalTemp;
            $scope.nextCalTemp = nextCalTemp;
        };

        $scope.toSchedule = function () {
            $scope.msg.isUserCustom = false;
            $scope.msg.targetValue = $scope.msg.currentCalTarget;
            $scope.send($scope.msg);
        };

        $scope.sendVal = function () {
            $scope.msg.targetValue = $scope.msg.userTargetValue;
            $scope.msg.isUserCustom = true;
            $scope.send($scope.msg);
        };
    }

    return {
        getHTML: function () {
            return getCSS() + getHTML();
        },
        getController: getController
    };
};