const fetch = require('node-fetch');
const moment = require('moment-timezone');
require('dotenv').config();

const OWM_API_KEY = process.env.OWM_API_KEY;
const DUBLIN_ID = '2964574';
const BOSTON_ID = '4951305';

const BOSTON_API_URL = `http://api.openweathermap.org/data/2.5/weather?id=${BOSTON_ID}&APPID=${OWM_API_KEY}&units=imperial`;
const DUBLIN_API_URL = `http://api.openweathermap.org/data/2.5/weather?id=${DUBLIN_ID}&APPID=${OWM_API_KEY}&units=metric`;

const getWeather = (data, unit) => {
  const temp = data.main.temp;
  const condition = (() => {
    if (!data.weather.length) return null;
    return {
      condition: data.weather[0].main,
      condition_detail: data.weather[0].description,
      icon: data.weather[0].icon.replace(/[a-z]+$/, ''),
    };
  })();

  return {
    temp,
    unit,
    condition,
  };
};

exports.handler = async (event, context) => {
  let bostonData, dublinData;
  const startTime = new Date();
  return fetch(BOSTON_API_URL)
    .then(response => response.json())
    .then(data => {
      bostonData = getWeather(data, 'F');
    })
    .then(() => {
      return fetch(DUBLIN_API_URL);
    })
    .then(response => response.json())
    .then(data => {
      dublinData = getWeather(data, 'C');
    })
    .then(() => {
      const bostonTime = moment(new Date(new Date().toUTCString()))
        .tz('America/New_York')
        .format('hh:mm a');
      const dublinTime = moment(new Date(new Date().toUTCString()))
        .tz('Europe/Dublin')
        .format('hh:mm a');

      bostonData.time = bostonTime;
      dublinData.time = dublinTime;

      const endTime = new Date();
      return {
        statusCode: 200,
        body: JSON.stringify({
          bostonData,
          dublinData,
          startTime,
          endTime,
        }),
      };
    })
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
