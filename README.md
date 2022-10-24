# FCC: Use the Twitch JSON API

**Objective**: Build an app that is functionally similar to this: https://codepen.io/freeCodeCamp/full/Myvqmo/.

The Twitch API is a RESTful API that lets developers build creative integrations for the broader Twitch community.

Fulfill the below user stories and get all of the tests to pass. Use whichever libraries or APIs you need. Give it your own personal style.

**User Story**: I can see whether freeCodeCamp is currently streaming on Twitch.tv.

**User Story**: I can click the status output and be sent directly to the freeCodeCamp's Twitch.tv channel.

**User Story**: If a Twitch user is currently streaming, I can see additional details about what they are streaming.

**Hint**: Here's an array of the Twitch.tv usernames of people who regularly stream: <code>["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"]</code>

**UPDATE**: Due to a change in conditions on API usage, Twitch.tv requires an API key, but we've built a workaround. Use https://twitch-proxy.freecodecamp.rocks/ instead of Twitch's API base URL and you'll still be able to get account information, without needing to sign up for an API key.

When you are finished, include a link to your project on CodePen and click the "I've completed this challenge" button.

You can get feedback on your project by sharing it on the [freeCodeCamp forum](https://forum.freecodecamp.org/c/project-feedback/409).

**Solution Link**
https://bit.ly/3N51FBI

---

### Folder Structure

```sh
public/
├─ favicon.ico
├─ index.html
src/
├─ App.css
├─ App.js
├─ index.js
package-lock.json
package.json
```

## Steps to complete the project

### Step 1: Set the initial states of players, loading, status (all/online/offline) and useRef

```js
    const [players, setPlayers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState("all");
    const useRef = React.useRef(0);
```


### Step 2: Set the default channels of Twitter players

```js
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
```

### Step 3: Create the function fetchData to obtain the Twitch JSON API

**App.js**

```
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
            output.push([user]);
        }

        setPlayers(output);
        setLoading(false);
    };
```

### Step 4: Use useEffect to call function fetchData as loading state is true


```js
    useEffect(() => {
        if (loading === true) {
            fetchData();
        }
        useRef.current += 1;
    }, [players]);
```

- As the **loading** state is **true**, it returns the loading animation

```
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
```


### Step 5: Create function handleClick to set the status (all/online/offline) and render the PlayerTable


```js
    const handleClick = (status) => {
        setStatus(status);
        PlayerTable(status);
    };
```


### Step 6: Create the PlayTable to render the players' status (all/online/offline)

- Create buttons for the **status** (all/online/offline) in the table header

```js
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
```

- Show **all** the players as status is not online **and** offline

```js

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
```

- Show **online/offline** the players as status is online **or** offline

```js
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
```

### Step 7: Return **App** function with PlayerTable


```js
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
```
