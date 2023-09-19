import { useState } from "react";
import InfiniteScroll from "./component/InfiniteScroll";
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
