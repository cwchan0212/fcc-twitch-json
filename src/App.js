import "./App.css";
import React, { useEffect } from "react";

function App() {
    const [players, setPlayers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
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
        channels.forEach(async (channel) => {
            // console.log(channel);
            const streamUri = base + type + "/" + channel;
            const channelUri = base + type2 + "/" + channel;

            // console.log("streamUri", streamUri);
            const streamRes = await fetch(streamUri);
            const streamData = await streamRes.json();
            let game, status;

            if (streamRes.ok) {
                if (streamData.stream === null) {
                    game = "Offline";
                    status = "Offline";
                } else if (streamData.stream === undefined) {
                    game = "Account Closed";
                    status = "Offline";
                } else {
                    game = streamData.stream.game;
                    status = "Online";
                }

                const channelRes = await fetch(channelUri);
                const channelData = await channelRes.json();

                // console.log("channelUri", channelUri);
                // console.log("streamData", streamData)
                // console.log("channelData", channelData)

                if (channelRes.ok) {
                    const user = {
                        name:
                            channelData.display_name != null
                                ? channelData.display_name
                                : channel,
                        logo:
                            channelData.logo != null
                                ? channelData.logo
                                : "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F",
                        desc: status === "Online" ? channelData.status : "",
                        game: game,
                        url: channelData.url,
                    };
                    output.push(user);
                    setLoading(false);
                } else {
                    console.log("Fail to fetch channelRes...");
                }
            } else {
                console.log("Fail to fetch streamRes...");
            }
        });
        setPlayers(output);
        console.log("zzzz", players.length, output.length);
    };

    useEffect(() => {
        // if (players.length === 0) {
        fetchData();
        console.log("react", players);
        // }
        useRef.current += 1;
    }, []);

    if (loading) return <h1>Loading...</h1>;

    // console.log("useRef.current", useRef.current);

    const PlayerTable = () => {
        console.log("table", players);
        return players ? (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Twitch Streamers {useRef.current}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.forEach(function (player, idx) {
                            <tr>
                                <td>type: {player.name}</td>

                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <></>
        );
    };


    return (
        <div className="App">
            <PlayerTable /><br/>
            {/* {JSON.stringify(players)}, */}
            length: {players.length}
        </div>
    );
}

export default App;
