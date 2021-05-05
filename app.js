// step 1

const cityInput = document.getElementById('insertCity');
const prognozaBtn = document.getElementById('prognozaBtn');
const prognozaDiv = document.getElementById('prognozaDiv');

const URL_CURRENT_WEATHER = 'https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=';

prognozaBtn.addEventListener('click', showWeather);

function showWeather(){

    // step 2
    let finalEndPoint = URL_CURRENT_WEATHER + cityInput.value;
    // console.log(finalEndPoint);

    // fetch from endpoint
    fetch(finalEndPoint)
        .then((res) => res.json())
        .then((data) =>{
            let prognozaBox = document.createElement('div');
            prognozaBox.classList.add('prognozaHours');
            prognozaBox.innerHTML = createPrognozaHours(
                data.name,
                data.weather[0].icon,
				data.weather[0].description,
                data.main.humidity,
                data.main.pressure,
                data.main.temp,
				data.main.temp_min,
				data.main.temp_max,
			);
            prognozaDiv.appendChild(prognozaBox);
            //remove input
            cityInput.value= '';
        });
}

// step 3
function createPrognozaHours(name, icon, description, humidity, pressure, temp, temp_min, temp_max) {
	let output = `
                <div class="prognozaHours card text-white bg-info mb-3" style="width: 18rem;">
                    <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${icon}.svg' 'alt='pic' width='50' height='50''</div>
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text">Umiditate: ${humidity}</p>
                        <p class="card-text">Presiune: ${pressure}</p>
                        <p class="card-text">Temperatura: ${temp}&#8451</p>
                        <p class="card-text">Minima zilei: ${temp_min}&#8451</p>
                        <p class="card-text">Maxima zilei: ${temp_max}&#8451</p>
                </div>`;
	return output;
}





// forecast


const forecastBtn= document.getElementById('forecastBtn');
const forecastDiv = document.getElementById('forecastDiv');

const URL_FORECAST_WEATHER ='https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=';

forecastBtn.addEventListener('click', showForecast);
function showForecast(){
    let finalEndPoint = URL_FORECAST_WEATHER + cityInput.value;

    fetch(finalEndPoint)
        .then((res) => res.json())
        .then((data) => {
            var numarDePrognozeZiuaCurenta = 0;
			for (let i = 0; i < data.list.length; i++) {
				if (
					data.list[i].dt_txt.split(' ')[0] !==
					data.list[i + 1].dt_txt.split(' ')[0]
				) {
					numarDePrognozeZiuaCurenta = i + 1;
					break;
				}
			}
			// console.log(numarDePrognozeZiuaCurenta);

			// prognozaDiv.innerHTML = '';
			createForecastBoxDiv(
				data,
				prognozaDiv,
				0,
				numarDePrognozeZiuaCurenta - 1
			);
			createForecastBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta,
				numarDePrognozeZiuaCurenta + 7
			);
			createForecastBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 8,
				numarDePrognozeZiuaCurenta + 15
			);
			createForecastBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 16,
				numarDePrognozeZiuaCurenta + 23
			);
			createForecastBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 24,
				numarDePrognozeZiuaCurenta + 31
			);
			createForecastBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 32,
				data.list.length - 1
			);
		});
}

function createForecast(icon, day, hour, temp, description) {
	let result = `
    <div class="prognozaDays card text-white bg-info mb-3" style="width: 18rem;">
    <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${icon}.svg' 'alt='pic' width='50' height='50''</div>
      <h7 class="card-title">Ziua: ${day}</h7>
      <p class="card-text">Ora: ${hour}</p>
      <p class="card-text">Temp: ${temp}</p>
      <p class="card-text">Desc: ${description}</p>
    </div>`;
	return result;
}

function createForecastBoxDiv(data, divElement, startIndex, endIndex) {
	let forecastBox = document.createElement('div');
	forecastBox.classList.add('prognozaDays');
	for (let i = startIndex; i <= endIndex; i++) {
		forecastBox.innerHTML += createForecast(
            data.list[i].weather[0].icon,
			data.list[i].dt_txt.split(' ')[0],
			data.list[i].dt_txt.split(' ')[1],
			data.list[i].main.temp,
			data.list[i].weather[0].description
		);
	}
	divElement.appendChild(forecastBox);
}