import axios from 'axios';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const getPokemonData = async (): Promise<Pokemon[]> => {
  const response = await axios.get(
    'https://pokeapi.co/api/v2/pokemon?limit=36'
  );
  const results = response.data.results;
  const pokemonData: Pokemon[] = [];

  for (const result of results) {
    const pokemonResponse = await axios.get(result.url);
    const { id, name, sprites } = pokemonResponse.data;
    const image = sprites.front_default;
    pokemonData.push({ id, name, image });
  }

  return pokemonData;
};

export default getPokemonData;
