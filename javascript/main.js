(function(){
	'use strict';
	//Angular Module Initialization
	var app=angular.module('BookingApp',[])
	//Controller Initialization
	.controller('MainController',['$scope','$http',function($scope,$http) {
		$scope.bookings=[];
		$scope.name="Kannan";
		$scope.adultsmaximum=[1,2,3,4,5,6];
		$scope.kidsmaximum=[1,2];
		$scope.NoOfAdults;
		$scope.selecteddate;
		$scope.ticketprice=100;
		$scope.agedprice=70;
		$scope.count=0;
		$( "#datepicker" ).datepicker({ minDate: +1, maxDate: "+7D" });
		$scope.adultsselected=function() {
			$scope.adulttemplate=[];
			$scope.formfill=true;
			for(let i=0;i<$scope.NoOfAdults;i++) {
				console.log(i+1);
				$scope.adulttemplate.push({"id":i+1});
			}
			console.log($scope.adulttemplate);
		};
		$scope.kidsselected=function() {
			$scope.kidtemplate=[];
			console.log($scope.NoOfKids);
			for(let i=0;i<$scope.NoOfKids;i++) {
				$scope.kidtemplate.push({"id":i+1});
			}
			console.log($scope.kidtemplate);
		};
		$scope.lowerberthbook=function(index) {
			var booked=false;
			for(let i=0;i<index.seats.length;i++) {
				console.log(index.seats[i]["R"+(i+1)]);
				if(index.seats[i]["R"+(i+1)].lowerberthleft>=1) {
					booked=true;
					index.seats[i]["R"+(i+1)].seatsbooked+=1;
					index.seats[i]["R"+(i+1)].lowerberthleft-=1;
					index.seats[i]["R"+(i+1)].seatsleft-=1;
					index.seatsbooked+=1;
					let row=1;
					for(let j=0;j<3;j++) {
						if(index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].name.length<1) {
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].name=$scope.adulttemplate[0].name;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].age=$scope.adulttemplate[0].age;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].gender=$scope.adulttemplate[0].gender;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].id=index.date+index.count;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+row].totalcost=$scope.agedprice;
							break;
						}
						row+=3;
					}
					break;
				}
			}
			return booked;
		};
		$scope.womenbook=function(index) {
			var booked=$scope.lowerberthbook(index);
			if(!booked) {
				$scope.upperandmiddleberthbook(index);
			}
		};
		$scope.upperandmiddleberthbook=function(index) {
			var booked=false;
			for(let i=0;i<index.seats.length;i++) {
				console.log(index.seats[i]["R"+(i+1)]);
				if(index.seats[i]["R"+(i+1)].lowerberthleft>=1) {
					booked=true;
					index.seats[i]["R"+(i+1)].seatsbooked+=1;
					index.seats[i]["R"+(i+1)].lowerberthleft-=1;
					index.seats[i]["R"+(i+1)].seatsleft-=1;
					index.seatsbooked+=1;
					for(let j=1;j<=8;j++) {
						if(j===1 || j===4 || j===7) {
							continue;
						}
						else if(index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].name.length<1) {
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].name=$scope.adulttemplate[0].name;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].age=$scope.adulttemplate[0].age;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].gender=$scope.adulttemplate[0].gender;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].id=index.date+index.count;
							index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j].totalcost=$scope.agedprice;
							break;
						}
					}
					break;
				}
			}
			if(!booked) {
				$scope.lowerberthbook(index);
			}
		};
		$scope.bookticket=function(index) {
			for(let i=0;i<$scope.adulttemplate.length;i++) {
				if($scope.adulttemplate[i].gender=="Male" && $scope.adulttemplate[i].age>=60
				|| $scope.adulttemplate[i].gender=="Female" && $scope.adulttemplate[i].age>=50) {
					var booked=$scope.lowerberthbook(index);
					if(!booked) {
						alert("No Lower berth left choose another train");
						break;
					}
				}
				else if($scope.adulttemplate[i].gender=="Male") {
					$scope.upperandmiddleberthbook(index);
				}
				else if($scope.adulttemplate[i].gender=="Female") {
					$scope.womenbook(index);
				}
			}
		};
		$scope.checkticket=function(index) {
			console.log(index);
			if($scope.NoOfAdults<=index.seatsleft) {
				$scope.bookticket(index);
			}
			else {
				alert("seats are full");
			}
		}
		$scope.addticket=function() {
			var datefound=false;
			$scope.count++;
			$scope.bookings.forEach(function(index) {
				if(index.date===$scope.selecteddate) {
					//datefound=true;
					console.log(index);
					console.log("found");
					$scope.checkticket(index);
					datefound=true;
				}
				else {
					datefound=false;
				}
			});
			if(!datefound) {
				let temp={"date":$scope.selecteddate,"seatsbooked":0,"seatsleft":72,"count":0,seats:[]}
				$scope.bookings.push(temp);
				$scope.bookings.forEach(function(index) {
					if(index.date===$scope.selecteddate) {
						for(let i=1;i<=9;i++) {
							let temp={};
							temp["R"+i]={};
							index.seats.push(temp);
						}
						for(let i=0;i<9;i++) {
							index.seats[i]["R"+(i+1)].lowerberthleft=3;
    						index.seats[i]["R"+(i+1)].seatsbooked=0;
    						index.seats[i]["R"+(i+1)].seatsleft=8;
							for(let j=1;j<=8;j++) {
								index.seats[i]["R"+(i+1)]["R"+(i+1)+"B"+j]={"name":"","age":null,"gender":"","id":null,"totalcost":null};
						  	}
						}
						$scope.checkticket(index);
						/*if($scope.NoOfAdults>5) {
							//console.log(index.seats);
							index.seats.forEach(function(seat) {
								console.log(seat);
								//console.log(seat.length);
								Object.keys(seat).forEach(function(row) {
									console.log(seat[row]);
									if(seat[row].seatsbooked===0) {
										seat[row].seatsbooked=6;
										Object.keys(seat[row]).forEach(function(data) {
											console.log(seat[row][data]);
										});
									}
								})
							});
						}*/
					}
				});
			}
			console.log($scope.bookings);
		};
	}])
})();