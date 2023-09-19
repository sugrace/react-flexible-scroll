import React, { JSXElementConstructor } from "react";
type InfiniteScrollInfo = {
    children: React.ReactElement<unknown, string | JSXElementConstructor<unknown>>[];
    getProducts: (pageIndex: number) => Promise<unknown[]>;
    maxPage: number;
    productCountPerPage: number;
    setProductList: (productList: unknown[]) => void;
    fetchingByProductListRowIndex?: number;
    productCountPerRow?: number;
    flexDirection?: React.CSSProperties["flexDirection"] | undefined;
    productWidth?: number;
    productHeight: number;
    productStyle?: React.CSSProperties;
};
declare function InfiniteScroll({ children, getProducts, maxPage, productCountPerPage, setProductList: setVisibleProductList, fetchingByProductListRowIndex, productCountPerRow, flexDirection, productWidth, productHeight, productStyle, }: InfiniteScrollInfo): import("react/jsx-runtime").JSX.Element;
export default InfiniteScroll;
