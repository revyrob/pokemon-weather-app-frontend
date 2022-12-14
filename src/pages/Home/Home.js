// import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.scss";
import { useEffect, useState } from "react";

export default function UploadPage() {
  //useState for weather in main bar
  const [temp, setTemp] = useState(0);
  const [background, setBackground] = useState(
    `http://localhost:8080/images/sun.jpg`
  ); //hardcoded picture of the sun from database
  const [city, setCity] = useState("No City");

  const [mocktail, setMocktails] = useState("");
  const [mocktailIng, setMocktailsIng] = useState("");

  const [_pokemonData, setPokemonData] = useState(null);
  // const [pokemonDetail, setPokemonDetail] = useState(null);
  const [list, setList] = useState([]);
  // const weather = "sunny";

  //current location and default is Vancouver,BC
  const [currentLocation, setCurrentLocation] = useState({
    userLat: null,
    userLng: null,
  });

  //variables for weather locations, API key, and the weatherbit url
  const apiKey = `${process.env.REACT_APP_APIKEY}`;

  //Geolocation for user
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          userLat: position.coords.latitude,
          userLng: position.coords.longitude,
        };
        setCurrentLocation({ location });
        const urlWeather = `https://api.weatherbit.io/v2.0/current?lat=${location.userLat}&lon=${location.userLng}&key=${apiKey}`;
        axios
          .get(urlWeather)
          .then((response) => {
            const app_temp = response.data.data[0].app_temp;
            const city = response.data.data[0].city_name;
            const precip = response.data.data[0].precip;
            const snow = response.data.data[0].snow;
            const cloud = response.data.data[0].clouds;
            const fog = response.data.data[0].fog;
            setTemp(app_temp);
            setCity(city);

            //for setting the mocktail
            axios.get(`http://localhost:8080/Mocktails`).then((response) => {
              response.data.map((e) => {
                if (app_temp < 0) {
                  if (e.weather == "cold") {
                    setMocktails(e.name); //set to picture of cloud
                    setMocktailsIng(e.method);
                  }
                } else if (app_temp < 20) {
                  if (e.weather == "warm") {
                    setMocktails(e.name); //set to picture of cloud
                    setMocktailsIng(e.method);
                  }
                } else {
                  if (e.weather == "hot") {
                    setMocktails(e.name); //set to picture of cloud
                    setMocktailsIng(e.method);
                  }
                }
              });
            });
            //set the background image
            if (precip >= 1) {
              axios
                .get(`http://localhost:8080/images/rain.jpg`)
                .then((response) => {
                  setBackground(`http://localhost:8080/images/rain.jpg`); //set to picture of rain
                })
                .catch((err) => console.log(err));
            } else if (snow >= 1) {
              axios
                .get(`http://localhost:8080/images/snow.jpg`)
                .then((response) => {
                  setBackground(`http://localhost:8080/images/snow.jpg`); //set to picture of snow
                })
                .catch((err) => console.log(err));
            } else if (cloud > 50) {
              axios
                .get(`http://localhost:8080/images/clouds.jpg`)
                .then((response) => {
                  setBackground(`http://localhost:8080/images/clouds.jpg`); //set to picture of cloud
                })
                .catch((err) => console.log(err));
            } else if (fog >= 35) {
              axios
                .get(`http://localhost:8080/images/fog.jpg`)
                .then((response) => {
                  setBackground(`http://localhost:8080/images/fog.jpg`);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      });
    } else {
      //alert!
      alert(`Geolocation is not supported by your browser.`);
    }
  };

  //call the geolocation function and it will have the necessary functions follow with
  //the correct geolocation
  useEffect(() => {
    getGeoLocation();
  }, []);

  const findPokemonWithName = (pokemonName) => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => {
        const pokemon = {
          name: pokemonName,
          url: response.data.sprites.front_default,
        };
        setList((prev) => [...prev, pokemon]);
      })
      .catch((error) => {
        console.error(`Couldn't get a response from the API: ${error}`);
      });
  };

  //function created for getting type of pokemon but didn't have time to fully implement
  // const getType = (type) => {
  //   axios.get("https://pokeapi.co/api/v2/type/").then((response) => {
  //     let type = response.data.results.find((e) => e.name === type);
  //     console.log(type.url);
  //     axios.get(`${type.url}`).then((response) => {
  //       console.log(response.data);
  //     });
  //   });
  // };

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/?limit=200")
      .then((response) => {
        setPokemonData(response.data.results);
        response.data.results.forEach((element) => {
          findPokemonWithName(element.name);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  if (!currentLocation) {
    <div>Loading..</div>;
  } else {
    return (
      <div
        className="pokemon"
        style={{
          backgroundImage: `url(${background})`,
          height: "100",
          width: "100",
          backgroundSize: "cover",
          backgroundRepeat: "none",
        }}
      >
        <div className="pokemon__weather">
          <div className="pokemon__weather-wrapper">
            <p className="pokemon__weather-info">{temp}??C</p>
            <p className="pokemon__weather-info--city">{city}</p>
          </div>
        </div>
        <div className="content">
          <p>A great mocktail to catch one of these pokemon....</p>
          <p className="pokemon__mocktail-info">{mocktail}</p>
        </div>
        <div className="pokemon__mocktail">
          <div className="pokemon__mocktail-wrapper">
            <p className="pokemon__mocktail-p">{mocktailIng}</p>
          </div>
        </div>
        <div className="pokemon__image">
          <div className="marquee">
            <div className="marquee-content">
              {list &&
                shuffleArray(list).map((e, i) => {
                  return (
                    <div key={i} className="marquee-item">
                      <img src={e.url} alt="pokemon image" />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
