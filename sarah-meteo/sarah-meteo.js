

var request = require('request');
var fs = require("fs-extra");
var os = require("os");
var path = require("path");

module.exports = function(RED) {
	
	
	
    function sarahmeteo(config) {
        RED.nodes.createNode(this,config);
		
		//recuperation des paramètres de configuration du plugin
		this.apikey = config.apikey;
		
        
		var node = this;
		
		

		node.on('input', function(msg) {
			
			//Récupération des paramètres provenant du fichier grammar/sarah-domoticz.xml retourné par win-sarah
			
			
			if (typeof msg.payload.options.day !== 'undefined') {
				day = msg.payload.options.day;
			}else{
				day = "0";
			}
			
			if (typeof msg.payload.options.id !== 'undefined') {
				city_id = msg.payload.options.id;
			}else{
				city_id = "2976179";
			}
			
			msg.speak = ""
			
			//var day = "1";
			//var city_id = "2976179";
			
			var url = 'http://api.openweathermap.org/data/2.5/forecast?units=metric&lang=fr&APPID='+node.apikey+'&id='+city_id;

			//effectue la requete http à domoticz 
			request(url, function (error, response, body) {
				
				var status_code = response.statusCode
				
				node.status({});
				if (error) {

					if (error.code === 'ETIMEDOUT') {

						setTimeout(function () {
						node.status({
							fill: "red",
							shape: "ring",
							text: "common.notification.errors.no-response"
						});
						}, 2);
						
						msg.speak = "Openweathermap est injoignable";
					
					}
					
							
					else {

						node.error(error, msg);
						msg.payload = error.toString() + " : " + url;
						msg.statusCode = error.code;
						//node.send(msg);
						node.status({
						fill: "red",
						shape: "ring",
						text: error.code
						});
						
						msg.speak = "Erreur avec openweathermap";
							
					} 
						
				}
				
				else {

					if (status_code == 200){
						
						var body = JSON.parse(body);
						
						var today = new Date();
						
						var date = new Date();
						
						var numToday = today.getDay();
						var city = body.city.name;
						
						// --- Récupération du jour de la semaine ---
						if (day == 'lundi')         { numDay = 1;}
						else if (day == 'mardi')    { numDay = 2;}
						else if (day == 'mercredi') { numDay = 3;}
						else if (day == 'jeudi')    { numDay = 4;}
						else if (day == 'vendredi') { numDay = 5;}
						else if (day == 'samedi')   { numDay = 6;}
						else if (day == 'dimanche') { numDay = 0;}
						else if (day == '0') { numDay = numToday;}
						else if (day == '1') { numDay = dayplus(today, 1);}
						else if (day == '2') { numDay = dayplus(today, 2);}

						var weather = body.list;

//////////////////////////////////////////////////////////////
						
						weather_data = get_weather_data(weather, 0, 23);
						
						if (typeof weather_data !== 'undefined' && Object.keys(weather_data).length > 0) {
							msg.weather = weather_data;
							
							//verifie si le jour demandé est aujourd'hui
							if (day_name(numDay) == day_name(numToday)){
								name_d = "aujourd'hui";
							}
							else{
								name_d = day_name(numDay);
							}
							
							tts = name_d+", "+weather_data.prevision+" prévu à "+city+", ";
							tts = tts + "les températures atteindront "+weather_data.tmin+" degrés pour les minimales et "+weather_data.tmax+" degrés pour les maximales , ";
							tts = tts + "L'humidité de l'air sera de "+weather_data.humidity+" % , et la vitesse du vent de "+weather_data.speed_wind+" Km/h";
							
							msg.speak = tts;
							
						} else{
							msg.speak = "Pas d'information trouvée sur open weather map";
						}
						

    
//////////////////////////////////////////////////////////////
				
					}else{
						
						if (status_code == 401){
							
							msg.speak = "la clé a p i est invalide"
							
						}else {
							
							msg.speak = "Erreur code retour "+status_code
						}

					}

				}
				
				node.send(msg);

			});

        });
    }
	

    RED.nodes.registerType("sarah-meteo",sarahmeteo);
}


function dayplus(d, num){
	
    if (d instanceof Date){
		//ne rien faire
	}else{
		d = new Date(d*1000);
	}
	
    var daytemp = d.setDate(d.getDate() + num);
    daytemp = new Date(daytemp);
    daytemp = daytemp.getDay();
    
    return daytemp
    
}

function day_name(num_day){
	var liste_day = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
	
	name = liste_day[num_day];
	
	return name

}


function get_weather_data(weather, hour_min, hour_max){
	
	var liste_ok = [];
	
	for (var x in weather){
		
		timestamp = new Date(weather[x].dt * 1000)
		
		if (timestamp.getDay() == numDay && timestamp.getHours() >= hour_min && timestamp.getHours() < hour_max){ 
			liste_ok.push(weather[x])
		}
		
		if (typeof liste_ok !== 'undefined' && liste_ok.length > 0) {
			
			var n = liste_ok.length;
			
			var tmin = [];
			var tmax = [];
			var humidity = 0;
			var speed_wind = 0;
			var counts_description = {};
											
			
			for (var x in liste_ok){
				tmin.push(liste_ok[x].main.temp_min) 
				tmax.push(liste_ok[x].main.temp_max)
				
				humidity += liste_ok[x].main.humidity;
				speed_wind += liste_ok[x].wind.speed;
				counts_description[liste_ok[x].weather[0].description] = 1 + (counts_description[liste_ok[x].weather[0].description] || 0);
				
			}

			//tmin = tmin/n;
			//tmin = parseFloat(tmin.toFixed(1));
			tmin = Math.min.apply(null, tmin);
			tmin = parseFloat(tmin.toFixed(1));
				
			//tmax = tmax/n;
			//tmax = parseFloat(tmax.toFixed(1));
			tmax = Math.max.apply(null, tmax);
			tmax = parseFloat(tmax.toFixed(1));
			
			
			humidity = Math.round(humidity/n);
			
			speed_wind = speed_wind/n;
			speed_wind = Math.round(speed_wind / 1000*3600);
			
			var description = Object.keys(counts_description).sort(function(a, b) {
				return counts_description[b] - counts_description[a];
			})
			
			description = description[0];
			
			weather_data = {'tmin':tmin, 'tmax':tmax, 'humidity':humidity, 'speed_wind':speed_wind, 'prevision':description};
			
			
			
		} else {
			weather_data = {};
		}
		

	}	
	
	return weather_data;
	
	
	
	
	
	
}

