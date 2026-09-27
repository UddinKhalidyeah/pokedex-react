import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

    const [pokemons, setPokemons] = useState([])
    const [search, setSearch] = useState("")
    const [selectedPokemon, setSelectedPokemon] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const limit = 20

    useEffect(() => {
        getPokemons()
    }, [page])

    function getPokemons() {

        setLoading(true)

        let offset = (page - 1) * limit

        axios.get(
            `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        )
            .then(response => {

                let list = response.data.results
                let pokemonData = []

                list.forEach(pokemon => {

                    axios.get(pokemon.url)
                        .then(response => {

                            pokemonData.push(response.data)

                            if (pokemonData.length === list.length) {

                                pokemonData.sort(
                                    (a, b) => a.id - b.id
                                )

                                setPokemons(pokemonData)
                                setLoading(false)
                            }

                        })

                })

            })
    }

    function searchPokemon() {

        if (search === "") {
            return
        }

        axios.get(
            `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
        )
            .then(response => {

                setSelectedPokemon(response.data)

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })

            })
            .catch(() => {

                alert("Pokémon not found!")

            })
    }

    function clickPokemon(pokemon) {

        setSelectedPokemon(pokemon)

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    function nextPage() {

        if (page < 52) {

            setPage(page + 1)
            setSelectedPokemon(null)

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    function previousPage() {

        if (page > 1) {

            setPage(page - 1)
            setSelectedPokemon(null)

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    function home() {

        setPage(1)
        setSelectedPokemon(null)
        setSearch("")

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <>

            {/* HEADER */}

            <header className="header">

                <div className="terminal-status">
                    <span className="status-dot"></span>
                    SYSTEM ONLINE
                </div>

                <h1>
                    <span className="bracket">&lt;</span>
                    POKÉMON API
                    <span className="bracket">/&gt;</span>
                </h1>

                <p className="subtitle">
                    POKÉDEX DATABASE // ONLINE
                </p>

            </header>


            {/* NAVIGATION */}

            <div className="top-navigation">

                <button onClick={home}>
                    ⌂ HOME
                </button>

                <button
                    onClick={() =>
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: "smooth"
                        })
                    }
                >
                    ◈ DATABASE
                </button>

            </div>


            {/* SEARCH */}

            <div className="search">

                <div className="search-label">
                    &gt; SEARCH_DATABASE
                </div>

                <div className="search-wrapper">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        className="searchbox"
                        type="text"
                        placeholder="Enter Pokémon name..."
                        value={search}
                        onChange={e =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={e => {

                            if (e.key === "Enter") {
                                searchPokemon()
                            }

                        }}
                    />

                    <button
                        className="search-button"
                        onClick={searchPokemon}
                    >
                        SEARCH
                    </button>

                </div>

            </div>


            {/* SELECTED POKÉMON */}

            {selectedPokemon && (

                <div className="pokemon-info">

                    <div className="panel-header">

                        <span>
                            POKÉMON_DATA
                        </span>

                        <span className="live">
                            ● LIVE
                        </span>

                    </div>


                    <h2>
                        POKÉMON INFORMATION
                    </h2>


                    <div className="pokemon-display">

                        <div className="pokemon-image-box">

                            <div className="scan-line"></div>

                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`}
                                alt={selectedPokemon.name}
                            />

                        </div>


                        <div className="pokemon-main-data">

                            <div className="pokemon-number">
                                #{String(selectedPokemon.id).padStart(3, "0")}
                            </div>

                            <h2 className="pokemon-name">
                                {selectedPokemon.name}
                            </h2>

                            <div className="type-container">

                                {selectedPokemon.types.map(type => (

                                    <span
                                        className={`type ${type.type.name}`}
                                        key={type.type.name}
                                    >
                                        {type.type.name}
                                    </span>

                                ))}

                            </div>

                        </div>

                    </div>


                    {/* BASIC INFORMATION */}

                    <div className="section-title">
                        // BASIC_INFORMATION
                    </div>

                    <div className="info-grid">

                        <div>
                            <strong>ID</strong>
                            <p>
                                #{selectedPokemon.id}
                            </p>
                        </div>

                        <div>
                            <strong>SPECIES</strong>
                            <p>
                                {selectedPokemon.species.name}
                            </p>
                        </div>

                        <div>
                            <strong>HEIGHT</strong>
                            <p>
                                {selectedPokemon.height / 10} m
                            </p>
                        </div>

                        <div>
                            <strong>WEIGHT</strong>
                            <p>
                                {selectedPokemon.weight / 10} kg
                            </p>
                        </div>

                    </div>


                    {/* STATS */}

                    <div className="info-section">

                        <div className="section-title">
                            // BASE_STATS
                        </div>

                        {selectedPokemon.stats.map(stat => (

                            <div
                                className="stat"
                                key={stat.stat.name}
                            >

                                <span>
                                    {stat.stat.name}
                                </span>

                                <span className="stat-value">
                                    {stat.base_stat}
                                </span>

                            </div>

                        ))}

                    </div>


                    {/* MOVES */}

                    <div className="info-section">

                        <div className="section-title">
                            // AVAILABLE_MOVES
                        </div>

                        <p className="moves">

                            {selectedPokemon.moves
                                .slice(0, 12)
                                .map(move => move.move.name)
                                .join(" • ")}

                        </p>

                    </div>

                </div>

            )}


            {/* DATABASE HEADER */}

            <div className="database-header">

                <div>
                    <span className="green-dot"></span>
                    DATABASE CONNECTED
                </div>

                <span>
                    PAGE {page} / 52
                </span>

            </div>


            {/* LOADING / POKÉMON */}

            {loading ? (

                <div className="loading">

                    <div className="loading-spinner"></div>

                    <p>
                        LOADING POKÉMON DATABASE...
                    </p>

                </div>

            ) : (

                <div className="pokemon-container">

                    {pokemons.map(pokemon => (

                        <div
                            className={`pokemon-card ${
                                selectedPokemon &&
                                selectedPokemon.id === pokemon.id
                                    ? "selected"
                                    : ""
                            }`}
                            key={pokemon.id}
                            onClick={() =>
                                clickPokemon(pokemon)
                            }
                        >

                            <div className="card-number">
                                #{String(pokemon.id).padStart(3, "0")}
                            </div>

                            <div className="card-image">

                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                    alt={pokemon.name}
                                />

                            </div>

                            <p>
                                {pokemon.name}
                            </p>

                            <div className="card-types">

                                {pokemon.types.map(type => (

                                    <span
                                        className={`mini-type ${type.type.name}`}
                                        key={type.type.name}
                                    >
                                        {type.type.name}
                                    </span>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            )}


            {/* PAGINATION */}

            <div className="pagination">

                <button
                    onClick={previousPage}
                    disabled={page === 1}
                >
                    ◀ PREVIOUS
                </button>

                <p>
                    <span className="page-symbol">
                        [ {page} ]
                    </span>
                </p>

                <button
                    onClick={nextPage}
                    disabled={page === 52}
                >
                    NEXT ▶
                </button>

            </div>


            {/* FOOTER */}

            <footer>

                <div>
                    POKÉDEX SYSTEM v2.0
                </div>

                <div>
                    API STATUS:
                    <span> ONLINE</span>
                </div>

                <div>
                    &lt;/&gt; POWERED BY POKEAPI
                </div>

            </footer>

        </>
    )
}

export default App
