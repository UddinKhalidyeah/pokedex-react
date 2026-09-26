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
                                pokemonData.sort((a, b) => a.id - b.id)
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

            <h1>Pokémon API</h1>

            <div className="search">

                <input
                    className="searchbox"
                    type="text"
                    placeholder="Enter Pokémon name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            searchPokemon()
                        }
                    }}
                />

                <button onClick={searchPokemon}>
                    Search
                </button>

            </div>

            {selectedPokemon && (

                <div className="pokemon-info">

                    <h2>Pokémon Information</h2>

                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`}
                        alt={selectedPokemon.name}
                    />

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

                    <div className="info-grid">

                        <div>
                            <strong>ID</strong>
                            <p>#{selectedPokemon.id}</p>
                        </div>

                        <div>
                            <strong>Species</strong>
                            <p>{selectedPokemon.species.name}</p>
                        </div>

                        <div>
                            <strong>Height</strong>
                            <p>{selectedPokemon.height / 10} m</p>
                        </div>

                        <div>
                            <strong>Weight</strong>
                            <p>{selectedPokemon.weight / 10} kg</p>
                        </div>

                        <div>
                            <strong>Experience</strong>
                            <p>{selectedPokemon.base_experience}</p>
                        </div>

                        <div>
                            <strong>Order</strong>
                            <p>{selectedPokemon.order}</p>
                        </div>

                    </div>

                    <div className="info-section">

                        <h3>Abilities</h3>

                        <p>
                            {selectedPokemon.abilities.map(
                                ability => ability.ability.name
                            ).join(", ")}
                        </p>

                    </div>

                    <div className="info-section">

                        <h3>Base Stats</h3>

                        {selectedPokemon.stats.map(stat => (

                            <div
                                className="stat"
                                key={stat.stat.name}
                            >

                                <span>
                                    {stat.stat.name}
                                </span>

                                <span>
                                    {stat.base_stat}
                                </span>

                            </div>

                        ))}

                    </div>

                    <div className="info-section">

                        <h3>Moves</h3>

                        <p className="moves">

                            {selectedPokemon.moves
                                .slice(0, 10)
                                .map(move => move.move.name)
                                .join(", ")}

                        </p>

                    </div>

                </div>

            )}

            <div className="top-navigation">

                <button onClick={home}>
                    Home
                </button>

                <button
                    onClick={previousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <button
                    onClick={nextPage}
                    disabled={page === 52}
                >
                    Next
                </button>

            </div>

            <h2>Pokémon List</h2>

            {loading ? (

                <p>Loading Pokémon...</p>

            ) : (

                <div className="pokemon-container">

                    {pokemons.map(pokemon => (

                        <div
                            className={
                                selectedPokemon &&
                                selectedPokemon.id === pokemon.id
                                    ? "pokemon-card selected"
                                    : "pokemon-card"
                            }
                            key={pokemon.id}
                            onClick={() => clickPokemon(pokemon)}
                        >

                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                alt={pokemon.name}
                            />

                            <p>{pokemon.name}</p>

                            <div className="type-container">

                                {pokemon.types.map(type => (

                                    <span
                                        className={`type ${type.type.name}`}
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

            <div className="pagination">

                <button
                    onClick={previousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <p>
                    Page {page}
                </p>

                <button
                    onClick={nextPage}
                    disabled={page === 52}
                >
                    Next
                </button>

            </div>

        </>
    )
}

export default App