import "./App.css";
import React, { useEffect } from "react";

function App() {
    const [players, setPlayers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState("all");
    const useRef = React.useRef(0);
    const channels = [
        "ESL_SC2",
        "OgamingSC2",
        "cretetion",
        "freecodecamp",
        "storbeck",
        "habathcx",
        "RobotCaleb",
        "noobs2ninjas",
    ];

    const fetchData = async () => {
        let output = [];
        const base = "https://twitch-proxy.freecodecamp.rocks/twitch-api/";
        const type = "streams";
        const type2 = "channels";
        let game, status;

        for (let channel of channels) {
            const uri = base + type + "/" + channel;
            const res = await fetch(uri);
            const data = await res.json();
            // console.log(uri);

            if (data.stream === null) {
                game = "Offline";
                status = "Offline";
            } else if (data.stream === undefined) {
                game = "Account Closed";
                status = "Offline";
            } else {
                game = data.stream.game;
                status = "Online";
            }

            const uri2 = base + type2 + "/" + channel;
            const res2 = await fetch(uri2);
            const data2 = await res2.json();
            // console.log(uri2);

            const user = {
                name: data2.display_name != null ? data2.display_name : channel,
                logo:
                    data2.logo != null
                        ? data2.logo
                        : "https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg",
                status: status === "Online" ? data2.status : "Offline",
                game: game,
                url: data2.url,
            };
            console.log("user", user.name);
            output.push([user]);
        }

        console.log("done");

        setPlayers(output);
        setLoading(false);
        // console.log("zzzz", players.length, output.length);
    };

    useEffect(() => {
        if (loading === true) {
            fetchData();
            console.log("react", players);
        }
        useRef.current += 1;
    }, [players]);

    if (loading) return <h1>Loading...</h1>;

    // console.log("useRef.current", useRef.current);
    const count = players.reduce((acc, o) => acc + Object.keys(o).length, 0);
    console.log("table", players, players.length, count);

    const handleClick = (status) => {
        console.log(status);
        setStatus(status)
        PlayerTable();
    }


    const PlayerTable = ({status}) => {

        return (
            <div class="players">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <th colspan="3"><h3>Twitch Streamers - {status}</h3></th>
                        </tr>
                        <tr>
                            <th  colspan="3">
                                <button type="button" onClick={() => handleClick("all")}>All</button>
                                <button type="button" onClick={() => handleClick("online")}>Online</button>
                                <button type="button" onClick={() => handleClick("offline")}>Offline</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>


                
                        {players.map((player, index) => {
                            return (
                                <tr class={ (player[0].status) !== "Offline" ? "online" : "offline"}>
                                    <td key={index}>
                                        <img class="icon" src={player[0].logo} />
                                    </td>
                                    <td>
                                        <a href={player[0].url} border="0" target="_blank" > {player[0].name} </a>
                                    </td>
                                    <td>{player[0].status}</td>
                                </tr>
                            );
                        })}
                        
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="App">
            <br />
            <PlayerTable status={status}/>
            <br />
        </div>
    );
}

export default App;
