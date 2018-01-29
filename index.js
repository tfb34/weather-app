window.onload = function(){

	const searchBtn = document.getElementById('search-btn');
	const us = document.getElementById('us');
	const outside = document.getElementById('outside');

	const form = document.getElementsByTagName('form')[0];
	const city = form['city'];
	const state = form['state'];

	// info
	const location = document.getElementById('location');
	const checkbox = document.getElementById('checkbox');
	const header = document.getElementById('header');
	const temp = document.getElementById('temp');
	const icon = document.getElementById('icon');
	const weather = document.getElementById('weather');
	const feels = document.getElementById('feels');
	const uv = document.getElementById('uv');

	const pic = document.getElementById('pic');
	// right now 
	const wind = document.getElementById('wind');
	const humidity = document.getElementById('humidity');
	const dewPoint = document.getElementById('dewPoint');
	const pressure = document.getElementById('pressure');
	const visibility = document.getElementById('visibility');

	const api_key = '68ac779d91f6724c';

	let resp;

	let initialRequest = 'https://api.wunderground.com/api/'+api_key+'/conditions/q/autoip.json';
	
	makeRequest(initialRequest);

	const hours = new Date().getHours();
	const isDayTime = hours > 6 && hours < 20;

	searchBtn.addEventListener("click", validate);

	us.addEventListener("click", function(){
		changeForm(this.id);
	});

	checkbox.addEventListener("click", changeDataFormat);

	function changeDataFormat(){
		if(checkbox.checked){
			displayData(resp, "c");
		}else{
			displayData(resp, "f");
		}
	}

	document.addEventListener("keydown",function(event){
		if(event.which === 13){
			validate()
		}
	});

	outside.addEventListener("click", function(){
		changeForm(this.id);
	});

	changeBackground();


	function changeForm(id){
	
		if(id === 'us' && state.placeholder==="country"){
			city.value = "";
			state.value = "";
			state.placeholder = "state";
		}else if(id === "outside" && state.placeholder === "state"){
			city.value = "";
			state.value = "";
			state.placeholder = "country";
		}
	}

	function validate(){
		let form = document.getElementsByTagName('form')[0];
		let error = document.getElementById('error');

		if(city.value && state.value){
			error.innerHTML = "";
			error.className = "";
			search();
		}else{
			error.innerHTML = "Please fill out all fields.";
			error.className = "error";
		}
	}

	function search(){
		let form = document.getElementsByTagName('form')[0];
		let city = form['city'].value;
		let state = form['state'].value;
		let request = 'https://api.wunderground.com/api/'+api_key+'/conditions/q/'+state+'/'+city+'.json';
		makeRequest(request);
		
	}

	function makeRequest(request){
		fetch(request)
			.then(function(response){
				return response.json()
			})
			.then(function(response){
				resp = response.current_observation;// in case user wants to change to C
				let format = 'f';
				if(checkbox.checked){
					format = 'c';
				}
				displayData(response.current_observation, format);
			})
			.catch(e => {
				console.log(e)
			})
	}

	function displayData(r, type){
		let x = '&#8457;'; // f
		if(type === 'c'){
			x = '&#8451;';
		}
		header.innerHTML = r['observation_time'];
		location.innerHTML = r.display_location['full'];
		temp.innerHTML = r['temp_'+type] + x;

		let str = r['icon_url'];
		console.log(str.replace(/http/i, 'https'));
		icon.src = str.replace(/http/i, 'https');
		
		weather.innerHTML = r['weather'].toUpperCase();

		getPic(r['weather']);

		feels.innerHTML = "feels like "+r['feelslike_'+type]+x;
		uv.innerHTML = "UV Index "+r['UV']+" of 10";

		wind.innerHTML = r['wind_string'];
		humidity.innerHTML = r['relative_humidity'];
		dewPoint.innerHTML = r['dewpoint_'+'f']+x;
		pressure.innerHTML = r['pressure_in']+'in';
		visibility.innerHTML = r['visibility_mi']+'mi';
	}

	function getPic(str){
		 r = 'https://api.giphy.com/v1/gifs/translate?api_key=lwruPkURFqMcbywpQQKRElLX6NPl6ySI&s='+str;
		fetch(r, {mode: 'cors'})
		.then(function(response){
			return response.json()
		})
		.then(function(response){
			pic.src = response.data.images.original.url
		})
		.catch(e => {
			console.log("There was an error in retreiving giphy");
		})
	}

	function changeBackground(){
		if(isDayTime){
			document.getElementsByTagName('body')[0].className  = "lightDay";
			document.getElementsByTagName('form')[0].className = "darkDay";
			document.getElementById('info').className = "darkDay";
		}else{
			document.getElementsByTagName('body')[0].className  = "lightNight";
			document.getElementsByTagName('form')[0].className = "darkNight";
			document.getElementById('info').className = "darkNight";
		}
	}

}