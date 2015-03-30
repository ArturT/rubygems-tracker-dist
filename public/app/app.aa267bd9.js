"use strict";angular.module("rubygemsTrackerApp.services",[]),angular.module("rubygemsTrackerApp.factories",[]),angular.module("rubygemsTrackerApp.controllers",["rubygemsTrackerApp.services","rubygemsTrackerApp.factories","chart.js"]),angular.module("rubygemsTrackerApp",["ngCookies","ngResource","ngSanitize","ui.router","ui.bootstrap","rubygemsTrackerApp.controllers"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("404",{url:"/404",templateUrl:"components/errors/404.html"}),b.otherwise("/"),c.html5Mode(!0)}]).run(["$rootScope","$state",function(a,b){a.$on("$stateChangeError",function(){b.go("404")})}]),angular.module("rubygemsTrackerApp.controllers").controller("GemCtrl",["$scope","$http","GemService",function(a,b,c){a.gems=[],c.all().then(function(b){a.gems=b.data})}]),angular.module("rubygemsTrackerApp").config(["$stateProvider",function(a){a.state("gems",{url:"/gems",templateUrl:"app/gem/index.html",controller:"GemCtrl"}).state("gemsAdd",{url:"/gems/add",templateUrl:"app/gem/add.html",controller:"GemAddCtrl"}).state("gemStats",{url:"/gems/:name",templateUrl:"app/gem/gem_stats.html",controller:"GemStatsCtrl",resolve:{promiseGem:["GemService","$stateParams",function(a,b){return a.get(b.name)}]}}).state("gemsThanks",{url:"/gems/:name/thanks",templateUrl:"app/gem/thanks.html",controller:"GemThanksCtrl"})}]),angular.module("rubygemsTrackerApp.services").service("GemService",["$http",function(a){var b="/api/gems";this.all=function(){return a.get(b)},this.get=function(c){return a.get(b+"/"+c)},this.getDetails=function(c){return a.get(b+"/"+c+"/details")},this.getVersions=function(c){return a.get(b+"/"+c+"/versions")},this.create=function(c){return a.post(b,{name:c})}}]),angular.module("rubygemsTrackerApp.controllers").controller("GemAddCtrl",["$scope","$http","$state","GemService",function(a,b,c,d){a.gemName="",a.clickedSubmit=!1,a.errors=[],a.addGem=function(){a.clickedSubmit=!0,d.create(a.gemName).then(function(){c.go("gemsThanks",{name:a.gemName})},function(b){a.clickedSubmit=!1;var c=[],d=b.data.errors;for(var e in d)c.push(d[e].message);a.errors=c})}}]),angular.module("rubygemsTrackerApp.controllers").controller("GemStatsCtrl",["$scope","$http","promiseGem","GemStatsFactory","GemService","DateService",function(a,b,c,d,e,f){var g=c.data;if(a.gem=g,a.gemTotalDownloads=g.totalDownloads,a.enabledStats=!1,a.recentDownloads={},a.totalDownloads={},g.gemStatistics.length>1){a.enabledStats=!0,a.datepicker={};var h=new d(g.gemStatistics,a.datepicker);h.prepareChart(a.recentDownloads,"Recent downloads","recentDownloads"),h.prepareChart(a.totalDownloads,"Total downloads","totalDownloads");var i=function(){h.updateChart(a.recentDownloads,"recentDownloads"),h.updateChart(a.totalDownloads,"totalDownloads")};a.datepicker.startDate={},a.datepicker.endDate={},a.datepicker.minDate=h.minDate,a.datepicker.maxDate=h.maxDate,a.datepicker.format="yyyy-MM-dd",a.datepicker.open=function(b,c){b.preventDefault(),b.stopPropagation(),"startDate"==c?a.datepicker.startDate.opened=!0:"endDate"==c&&(a.datepicker.endDate.opened=!0)},a.datepicker.lastDays=function(b){var c;c="all"==b?a.datepicker.minDate:_.takeRight(h.allDates,b)[0],a.datepicker.startDate.model=new Date(c),a.datepicker.endDate.model=new Date(a.datepicker.maxDate),a.datepicker.lastDaysValue=b,i()},a.datepicker.lastDays(30);var j=function(b){0==b&&(a.datepicker.lastDaysValue=null)};a.$watch("datepicker.startDate.model",i),a.$watch("datepicker.endDate.model",i),a.$watch("datepicker.startDate.opened",j),a.$watch("datepicker.endDate.opened",j)}e.getDetails(g.name).success(function(b){a.gemTotalDownloads=b.downloads,a.gemDetails=b}),e.getVersions(g.name).success(function(b){a.gemBuiltAt=b[0].built_at;var c={labels:[],data:[],type:"PolarArea"},d=_.sortBy(b,_.property("downloads_count")).reverse();_.forEach(d,function(a){if(c.labels.length<6){var b=a.number+" (Released "+f.cutDate(a.built_at)+")";c.labels.push(b),c.data.push(a.downloads_count)}}),c.toggle=function(){a.gemVersionsChart.type="PolarArea"===a.gemVersionsChart.type?"Pie":"PolarArea"},a.gemVersionsChart=c})}]),angular.module("rubygemsTrackerApp.factories").factory("GemStatsFactory",["DateService",function(a){return function(b,c){var d=_.map(b,function(b){return a.cutDate(b.date)});this.allDates=d,this.minDate=d[0],this.maxDate=_(d).last(),this.prepareChart=function(a,c,e){var f=_.map(b,e);a.labels=d,a.series=[c],a.data=[f]},this.updateChart=function(d,e){var f=a.parseDatepickerDate(c.startDate.model),g=a.parseDatepickerDate(c.endDate.model),h=[],i=[];_.forEach(b,function(b){var c=a.parseCuttedDate(b.date);c>=f&&g>=c&&(h.push(a.cutDate(b.date)),i.push(b[e]))}),d.labels=h,d.data=[i]}}}]),angular.module("rubygemsTrackerApp.controllers").controller("GemThanksCtrl",["$scope","$stateParams",function(a,b){a.gemName=b.name}]),angular.module("rubygemsTrackerApp.controllers").controller("MainCtrl",["$scope","$http","GemService",function(a,b,c){var d=["knapsack"];a.gems=[],c.all().success(function(b){a.gems=_.filter(b,function(a){return _.contains(d,a.name)})})}]),angular.module("rubygemsTrackerApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("rubygemsTrackerApp.services").service("DateService",function(){var a=function(a){return a.replace(/T.+/,"")};this.cutDate=a;var b=function(b){return Date.parse(a(b))};this.parseCuttedDate=b,this.parseDatepickerDate=function(a){return b(a.toJSON())}}),angular.module("rubygemsTrackerApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("rubygemsTrackerApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menu=[{title:"Home",link:"/"},{title:"Gems",link:"/gems"},{title:"Add gem",link:"/gems/add"}],a.isCollapsed=!0,a.isActive=function(a){return a===b.path()}}]),angular.module("rubygemsTrackerApp").run(["$templateCache",function(a){a.put("app/gem/add.html",'<header class=hero-unit id=banner><div class=container><h1>Add your Gem to track it!</h1><p class=lead>Provide your gem name and we will track download statistics for it.</p></div></header><div class=container><div class=row><div class="col-lg-5 col-lg-offset-4"><h1 class=page-header>What\'s your gem name?</h1><form ng-submit=addGem()><div class=input-group ng-class="{ \'has-error\': errors.length }"><input class=form-control placeholder="Gem name" ng-model=gemName id=gemName> <span class=input-group-btn><button class="btn btn-danger" type=submit id=submitButton><i class="fa fa-plus" ng-class="{ \'fa-circle-o-notch fa-spin\': clickedSubmit }"></i> Add</button></span></div><!-- /input-group --></form><div class="alert alert-danger margin-top" role=alert ng-repeat="error in errors">{{ error }}</div></div></div></div>'),a.put("app/gem/gem_stats.html",'<header class=hero-unit id=banner><div class=container><h1>{{gem.name}}</h1><span class="fa fa-refresh fa-4x fa-spin" ng-hide=gemDetails></span><p class=lead>{{gemDetails.info}}</p></div></header><div class=container><div class=row><div class=col-lg-12 ng-hide=enabledStats><div class="alert alert-warning">We need to collect statistics for two days at least before showing more detailed charts.</div></div></div><div class=row><div class=col-lg-12><h1 class=page-header>Basic gem info</h1></div><div class=col-lg-5><dl class="dl-horizontal dt-long"><dt>Total downloads</dt><dd>{{gemTotalDownloads | number}}</dd><dt>Current version downloads</dt><dd>{{(gemDetails.version_downloads | number) || \'-\'}}</dd><dt>Current gem version</dt><dd>{{gemDetails.version || \'-\'}}</dd><dt>Current gem built at</dt><dd>{{(gemBuiltAt | date) || \'-\'}}</dd><dt>Platform</dt><dd>{{gemDetails.platform || \'-\'}}</dd><dt>Authors</dt><dd>{{gemDetails.authors || \'-\'}}</dd></dl></div><div class=col-lg-7><dl class="dl-horizontal dt-long"><dt>Project URL</dt><dd><a ng-href={{gemDetails.project_uri}}>{{gemDetails.project_uri || \'-\'}}</a></dd><dt>Gem URL</dt><dd><a ng-href={{gemDetails.gem_uri}}>{{gemDetails.gem_uri || \'-\'}}</a></dd><dt>Homepage URL</dt><dd><a ng-href={{gemDetails.homepage_uri}}>{{gemDetails.homepage_uri || \'-\'}}</a></dd><dt>Wiki URL</dt><dd><a ng-href={{gemDetails.wiki_uri}}>{{gemDetails.wiki_uri || \'-\'}}</a></dd><dt>Documentation URL</dt><dd><a ng-href={{gemDetails.documentation_uri}}>{{gemDetails.documentation_uri || \'-\'}}</a></dd><dt>Mailing list URL</dt><dd><a ng-href={{gemDetails.mailing_list_uri}}>{{gemDetails.mailing_list_uri || \'-\'}}</a></dd><dt>Source code URL</dt><dd><a ng-href={{gemDetails.source_code_uri}}>{{gemDetails.source_code_uri || \'-\'}}</a></dd><dt>Bug tracker URL</dt><dd><a ng-href={{gemDetails.bug_tracker_uri}}>{{gemDetails.bug_tracker_uri || \'-\'}}</a></dd></dl></div></div><div ng-show=enabledStats><div class=row><div class=col-lg-12><h1 class=page-header>Select date range to refresh stats</h1><button type=button class="btn btn-sm" ng-class="{ \'btn-danger\' : datepicker.lastDaysValue == \'all\' }" ng-click="datepicker.lastDays(\'all\')">All the time</button> <button type=button class="btn btn-sm" ng-class="{ \'btn-danger\' : datepicker.lastDaysValue == \'365\' }" ng-click=datepicker.lastDays(365)>Last 365 Days</button> <button type=button class="btn btn-sm" ng-class="{ \'btn-danger\' : datepicker.lastDaysValue == \'30\' }" ng-click=datepicker.lastDays(30)>Last 30 days</button> <button type=button class="btn btn-sm" ng-class="{ \'btn-danger\' : datepicker.lastDaysValue == \'7\' }" ng-click=datepicker.lastDays(7)>Last 7 days</button></div><div class="col-lg-3 col-md-4 col-xs-6"><h4>Start date</h4><p class=input-group><input class=form-control datepicker-popup={{datepicker.format}} ng-model=datepicker.startDate.model is-open=datepicker.startDate.opened min-date=datepicker.minDate max-date=datepicker.maxDate ng-required="true"> <span class=input-group-btn><button type=button class="btn btn-default" ng-click="datepicker.open($event, \'startDate\')"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div><div class="col-lg-3 col-md-4 col-xs-6"><h4>End date</h4><p class=input-group><input class=form-control datepicker-popup={{datepicker.format}} ng-model=datepicker.endDate.model is-open=datepicker.endDate.opened min-date=datepicker.minDate max-date=datepicker.maxDate ng-required="true"> <span class=input-group-btn><button type=button class="btn btn-default" ng-click="datepicker.open($event, \'endDate\')"><i class="glyphicon glyphicon-calendar"></i></button></span></p></div></div><div class=row><div class=col-lg-12><h1 class=page-header>Recent downloads</h1>Daily downloads statistics.<canvas id=line class="chart chart-line" data=recentDownloads.data labels=recentDownloads.labels legend=true series=recentDownloads.series></canvas></div></div><div class=row><div class=col-lg-12><h1 class=page-header>Total downloads</h1>Total downloads growth.<canvas id=line class="chart chart-line" data=totalDownloads.data labels=totalDownloads.labels legend=true series=totalDownloads.series></canvas></div></div></div><div class=row ng-show=gemDetails><div class=col-lg-12><h1 class=page-header>The most popular gem versions</h1><button type=button class="btn btn-danger pull-right" ng-click=gemVersionsChart.toggle()>Toggle {{gemVersionsChart.type}}</button><canvas id=base class=chart-base chart-type=gemVersionsChart.type data=gemVersionsChart.data labels=gemVersionsChart.labels legend=true></canvas></div></div></div>'),a.put("app/gem/index.html",'<header class=hero-unit id=banner><div class=container><h1>Gems</h1><p class=lead>List of gems we are tracking.</p></div></header><div class=container><div class=row><div class=col-lg-12><h1 class="page-header text-center">Choose gem to see its stats</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="gem in gems"><li><a ng-href=/gems/{{gem.name}} tooltip={{gem.name}}>{{gem.name}}</a></li></ul></div></div></div>'),a.put("app/gem/thanks.html",'<header class=hero-unit id=banner><div class=container><h1 id=successMessage>Thanks!</h1><p class=lead>The {{gemName}} gem was added to our database.</p><p><a ng-href=/gems/{{gemName}} class="btn btn-lg btn-danger" id=gemLink>See stats for {{gemName}}</a></p></div></header>'),a.put("app/main/main.html",'<header class=hero-unit id=banner><div class=container><h1>\'Allo, \'Allo!</h1><p class=lead>Add your gem to track daily downloads and see trends.</p><a ng-href=/gems><img src=/assets/images/ruby-gem.d0f7f640.png alt=Gem></a></div></header><div class=container><div class=row><div class=col-lg-12><h1 class=page-header>See example statistics for:</h1><ul class="nav nav-tabs nav-stacked col-md-4 col-lg-4 col-sm-6" ng-repeat="gem in gems"><li><a ng-href=/gems/{{gem.name}} tooltip={{gem.name}}>{{gem.name}}</a></li></ul></div></div></div>'),a.put("components/errors/404.html","<header class=hero-unit id=banner><div class=container><h1>Error 404</h1><p class=lead>Page not found</p><img src=/assets/images/error.ee94a78e.png alt=Error></div></header>"),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><a href=https://github.com/ArturT/rubygems-tracker><img style="position: absolute; top: 0; right: 0; border: 0" src=https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67 alt="Fork me on GitHub" data-canonical-src=https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png></a> <button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>RubyGems Tracker</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li><iframe src="https://ghbtns.com/github-btn.html?user=arturt&repo=rubygems-tracker&type=star&count=true&size=large" frameborder=0 scrolling=0 width=160px height=30px class=github-stars></iframe></li></ul></div></div></div>')}]);