import { useEffect} from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromUrl } from './spotify';
import SpotifyWebApi from 'spotify-web-api-js';
import Player from './Player';
import { useDataLayerValue } from './DataLayer';

const spotify = new SpotifyWebApi();

function App() {

  const [{token},dispatch] = useDataLayerValue();

  useEffect (()=>{
    const hash  = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if(_token){

      dispatch({
        type:"SET_TOKEN",
        token:_token
      });
      spotify.setAccessToken(_token);

      spotify.getMe().then(user => {
        dispatch({
          type:"SET_USER",
          user:user,
        });
      });


      spotify.getPlaylist("37i9dQZF1DWStljCmevj7t").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );

      spotify.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );

      const userId = "31qxyjfnylxujoh63c747n6pwz3u";

      spotify.getUserPlaylists(userId).then((playlists) => {
        console.log("getplaylists:",playlists);
        dispatch({
          type: "SET_PLAYLISTS",
          playlists:playlists.body,
        });
      });
    }

  },[]);
  return (
    <div className="app">
    {token ? (
      <Player spotify = {spotify}/>
    ):(
      <Login/>
    )}
    </div>
  );
}

export default App;
