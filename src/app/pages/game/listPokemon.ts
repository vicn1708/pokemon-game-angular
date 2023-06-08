import axios from 'axios';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export const level = [
  {
    round: 1,
    x: 4,
    y: 4,
    radio: 4 * 4,
  },
  {
    round: 2,
    x: 6,
    y: 5,
    radio: 6 * 5,
  },
  {
    round: 3,
    x: 8,
    y: 5,
    radio: 8 * 5,
  },
  {
    round: 4,
    x: 10,
    y: 5,
    radio: 10 * 5,
  },
  {
    round: 5,
    x: 12,
    y: 5,
    radio: 12 * 5,
  },
];

const getPokemonData = async (l: number): Promise<Pokemon[]> => {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=${l! / 2}`
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
