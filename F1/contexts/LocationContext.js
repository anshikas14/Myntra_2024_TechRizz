import React, { useContext } from "react";
import { useEffect, useState } from "react";
// import currentIP from "../app/libs/ip.js";
import axios from "axios";
import { userContext } from "./UserContext.js";
import * as Location from 'expo-location';

export const LocationContext = React.createContext();

export default function LocationProvider(props) {
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
    loading: true,
  });
  const { token } = useContext(userContext);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState(null);
  const [dateDropdownLabel, setDateDropdownLabel] = useState([]);
  const [forecastDate, setForecastDate] = useState(null);
  const [forecastTime, setForecastTime] = useState("");
  const [sunButtonValue, setSunButtonValue] = useState("");

  const value = {
    coordinates,
    setCoordinates,
    currentWeather,
    weatherIcon,
    weatherLocation,
    setForecastTime,
    forecastDate,
    setForecastDate,
    dateDropdownLabel,
    sunButtonValue,
    setSunButtonValue,
  };

  useEffect(() => {
    const getCoordinates = (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          console.log("Permission to access location was denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
        const { latitude, longitude } = location.coords
        setCoordinates({
          ...coordinates,
          latitude,
          longitude, 
          loading: false
        });
      });

      getCoordinates()
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const getWeather = async () => {
      try {
        // const ip = await currentIP();

        const result = await axios({
          method: "get",
          url: `http://192.168.1.71:9000/weatherApiKey`,
        });
        const weatherApiKey = result.data

        if (!weatherApiKey) {
          return alert("The API key is not working!");
        }

        const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${weatherApiKey}&units=metric`;
        const callingUrl2 = await fetch(url2);
        const response2 = await callingUrl2.json();
        setWeatherLocation(response2.city.name);
        const threeHourWeatherForecast = response2.list;
        const weatherDetails = threeHourWeatherForecast.map((item) => {
          const time = item.dt_txt.split(" ")[1];
          const timeHour = parseInt(time[0] + time[1]);

          return {
            temperature: item.main.temp,
            date: item.dt_txt.split(" ")[0],
            time: item.dt_txt.split(" ")[1],
            icon:
              timeHour < 9 || timeHour > 20
                ? item.weather[0].icon.replace("d", "n")
                : item.weather[0].icon.replace("n", "d"),
            dayTimeButton:
              timeHour >= 6 && timeHour <= 9
                ? "sunrise"
                : timeHour >= 12 && timeHour <= 18
                ? "sun"
                : "sunset",
          };
        });

        const dateDetails = weatherDetails.map((item) => item.date);
        const uniqueDates = [...new Set(dateDetails)];
        setDateDropdownLabel(uniqueDates);  

        if (!forecastTime) {
          setForecastDate(weatherDetails[0].date);
          setForecastTime(weatherDetails[0].time);
          setSunButtonValue(weatherDetails[0].dayTimeButton);
          setCurrentWeather(weatherDetails[0].temperature.toFixed());
          setWeatherIcon(weatherDetails[0].icon);
          return
        }

        const findCurrentWeather = weatherDetails.find(
          (item) => item.date === forecastDate && item.time === forecastTime
        );

        if (!findCurrentWeather) {
          return;
        }

        setCurrentWeather(findCurrentWeather.temperature.toFixed());
        setWeatherIcon(findCurrentWeather.icon);
        
      } catch (error) {
        console.log("error in location context weather", error);
      }
    };

    getWeather();
  }, [coordinates, token, forecastDate, forecastTime]);

  return (
    <LocationContext.Provider value={value}>
      {props.children}
    </LocationContext.Provider>
  );
}
