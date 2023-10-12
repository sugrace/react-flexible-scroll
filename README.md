# react-flexible-scroll

react-flexible-scroll is a React component that provides an easy way to implement virtualized infinite scrolling functionality.

## Installation

You can install react-flexible-scroll using npm:

```
npm install react-flexible-scroll
```

## Example - codesandbox

```
https://codesandbox.io/p/sandbox/spring-meadow-y33c3q?file=%2Fsrc%2FApp.tsx%3A8%2C31
```

## Example - code

```
import { useState } from "react";
import { InfiniteScroll } from "react-flexible-scroll";
import axios from "axios";

const Product = () => {
  return <div>{"Sample"}</div>;
};

const LoadingProduct = () => {
  return <div>{"Loading"}</div>;
};

const getProducts = async (pageParam: number): Promise<unknown[]> => {
  const response = await axios.get("http://localhost:3000", {
    params: {
      page: pageParam,
      totalPage: 10,
      size: 20,
    },
  });
  if (response.status === 200) {
    return response.data.data.data || [];
  } else {
    return [];
  }
};

function App() {
  const [productList, setProductList] = useState<unknown[]>([]);

  return (
    <InfiniteScroll
      maxPage={10} // Required
      getProducts={getProducts} // Required
      setProductList={setProductList} // Required
      productCountPerPage={20} // Required
      productCountPerRow={2} // Not Required ( 1~3 recommended. default 1)
      productHeight={389} // Required
      productWidth={182} // Not Required (productsPerRow determine product's width)
      fetchingByProductListRowIndex={3} // Not Required (when the scroll position reaches a certain number of rows from the top, data is fetched. (default: 3))
      productStyle={{}} // Not Required (Product Custom Style)
      flexDirection={"row"} // Not Required ( default: row )
    >
      {productList.map((product) => {
        if (product.key) {
          return <Product key={product.key} />; // key is a unique property of a Product
        } else {
          return <LoadingProduct></LoadingProduct>; // Loading UI
        }
      })}
    </InfiniteScroll>
  );
}

export default App;

```

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
productStyle: React.CSSProperties
```

: Allows you to apply custom styles to your Product component.
