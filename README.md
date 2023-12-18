# react-flexible-scroll

react-flexible-scroll is a React component that provides an easy way to implement virtualized infinite scrolling functionality.

## Installation

You can install react-flexible-scroll using npm:

```
npm install react-flexible-scroll
```

## Demo

  <img src="https://github.com/sugrace/react-flexible-scroll/assets/46946800/33458b2e-6f26-404c-8ea4-fc4c94adcba7"/>

  <img src="https://github.com/sugrace/react-flexible-scroll/assets/46946800/6b6d7d4c-1d11-422d-ab4c-ed3b5eeadd07"/>

## Example - codesandbox

[codesandbox](https://codesandbox.io/p/sandbox/spring-meadow-y33c3q?file=%2Fsrc%2FApp.tsx%3A8%2C31)

## Example 2 - code (Practice)

```tsx
import { useState } from "react";
import { InfiniteScroll } from "react-flexible-scroll";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
}
const PokemonCard = ({ item }: { item: Pokemon; }) => {
  return <div>{item.name}</div>;
};

const LoadingCard = () => {
  return <div>{"Loading"}</div>;
};

function PokemonDex() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const getPokemonCards = async (page: number) => {
    // Page parameter is the page you are currently viewing.
    const limit = 20;
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
      productCountPerPage={20} // Required ( value should be identical to limit value in getProducts function )
      productCountPerRow={2} // Not Required ( 1~3 recommended. default 1)
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

export default PokemonDex;

## Props

### Required Props

```

maxPage: number

```

: Total number of pages.

```

getProducts: (page: number) => Promise<unknown[]>

```

: An asynchronous function that takes a page number as an argument and returns the data for that page.

```

setProductList: React.Dispatch<React.SetStateAction<unknown[]>>

```

: A state update function for the product list.

```

productCountPerPage: number

```

: The number of products to display per page.

```

productHeight: number

```

: Specifies the height of each product.

### Optional Props

```

productCountPerRow: 1~3 recommended. default 1

```

: The number of products to display in one row x.

```

fetchingByProductListRowIndex: default is 3

```

: Determines when data fetching should occur based on scroll position reaching a certain row from top

```

flexDirection: "row" or "column", default is "row"

```

: Determines layout orientation

```

productWidth: number

```

: Specifies width for each product item if needed.
```
