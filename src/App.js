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
                desc: status === "Online" ? data2.status : "Offline",
                game: game,
                status: status === "Online" ? "online" : "offline",
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

    if (loading) {
        return (
            <>
                <div class="container">
                    <div class="loader">
                        <div class="loader--dot"></div>
                        <div class="loader--dot"></div>
                        <div class="loader--dot"></div>
                        <div class="loader--dot"></div>
                        <div class="loader--dot"></div>
                        <div class="loader--dot"></div>
                        <div class="loader--text"></div>
                    </div>
                </div>
            </>
        );
    }

    // console.log("useRef.current", useRef.current);
    const count = players.reduce((acc, o) => acc + Object.keys(o).length, 0);
    console.log("table", players, players.length, count);

    const handleClick = (status) => {
        console.log(status);
        setStatus(status);
        PlayerTable(status);
    };

    const PlayerTable = ({ status }) => {
        return (
            <div class="players">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <th colspan="3">
                                <h3>Twitch Streamers</h3>
                            </th>
                        </tr>
                        <tr>
                            <th colspan="3">
                                <button
                                    class="btn btn-primary btn-sm"
                                    type="button"
                                    onClick={() => handleClick("all")}
                                >
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>{" "}
                                    All
                                </button>
                                <button
                                    class="btn btn-warning btn-sm"
                                    type="button"
                                    onClick={() => handleClick("online")}
                                >
                                    <i class="fa-solid fa-circle-up"></i> Online
                                </button>
                                <button
                                    class="btn btn-danger btn-sm"
                                    type="button"
                                    onClick={() => handleClick("offline")}
                                >
                                    <i class="fa-solid fa-circle-down"></i>{" "}
                                    Offline
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {status !== "online" && status !== "offline" ? (
                            <>
                                {players.map((player, index) => {
                                    return (
                                        <tr class={player[0].status}>
                                            <td key={index}>
                                                <img
                                                    class="icon"
                                                    src={player[0].logo}
                                                    alt =""
                                                />
                                            </td>
                                            <td>
                                                <a
                                                    href={player[0].url}
                                                    border="0"
                                                    target="_blank" rel="noreferrer"
                                                >
                                                    {" "}
                                                    {player[0].name}{" "}
                                                </a>
                                            </td>
                                            <td>{player[0].desc}</td>
                                        </tr>
                                    );
                                })}
                            </>
                        ) : (
                            <>
                                {players.map((player, index) => {
                                    if (player[0].status === status) {
                                        return (
                                            <tr class={player[0].status}>
                                                <td key={index}>
                                                    <img
                                                        class="icon"
                                                        src={player[0].logo} 
                                                        alt=""
                                                    />
                                                </td>
                                                <td>
                                                    <a
                                                        href={player[0].url}
                                                        border="0"
                                                        target="_blank" rel="noreferrer"
                                                    >
                                                        {" "}
                                                        {player[0].name}{" "}
                                                    </a>
                                                </td>
                                                <td>{player[0].desc}</td>
                                            </tr>
                                        );
                                    }
                                })}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="App">
            <div className="banner">
                <img
                    className="logo"
                    src="https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg"
                    alt="freeCodeCamp"
                    loading="lazy"
                />{" "}
                =&gt; Use Twitch JSON API
            </div>
            <PlayerTable status={status} />
        </div>
    );
}

export default App;
