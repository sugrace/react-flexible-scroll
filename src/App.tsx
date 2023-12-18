import { useState } from "react";
import { InfiniteScroll } from "react-flexible-scroll";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
}
const PokemonCard = ({ item }: { item: Pokemon }) => {
  return (
    <div
      style={{
        display: "flex",
        background: "#60FBC5",
        width: "100%",
        height: "100%",
        border: "2px  solid",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "50%",
          height: "70%",
          background: "white",
        }}
      >
        {item.name}
      </div>
    </div>
  );
};

const LoadingCard = () => {
  return <div>{"Loading"}</div>;
};

function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const getPokemonCards = async (page: number) => {
    // Page parameter is the page you are currently viewing.
    const limit = 27;
    const offset = page * limit;
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      return response.data.results;
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
    }
  };

  return (
    <InfiniteScroll
      maxPage={20} // Required
      getProducts={getPokemonCards} // Required
      setProductList={setPokemonList} // Required
      productCountPerPage={27} // Required ( value should be identical to limit value in getProducts function )
      productCountPerRow={3} // Not Required ( 1~3 recommended. default 1)
      productHeight={189} // Required
      productWidth={150} // Not Required (productsPerRow determine product's width)
      fetchingByProductListRowIndex={3} // Not Required (when the scroll position reaches a certain number of rows from the top, data is fetched. (default: 3))
      flexDirection={"row"} // Not Required ( default: row )
    >
      {pokemonList?.map((pokemon) => {
        if (pokemon.name) {
          return <PokemonCard key={pokemon.name} item={pokemon} />;
        } else {
          return <LoadingCard />; // Loading UI
        }
      })}
    </InfiniteScroll>
  );
}

export default App;
