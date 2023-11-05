import * as React from "react";
import { JSXElementConstructor } from "react";
type InfiniteScrollInfo = {
    children: React.ReactElement<any, string | JSXElementConstructor<any>>[];
    getProducts: (pageIndex: number) => Promise<any[]>;
    maxPage: number;
    productCountPerPage: number;
    setProductList: (productList: any[]) => void;
    fetchingByProductListRowIndex?: number;
    productCountPerRow?: number;
    flexDirection?: React.CSSProperties["flexDirection"] | undefined;
    productWidth?: number;
    productHeight: number;
    productStyle?: React.CSSProperties;
};
declare const InfiniteScroll: ({ children, getProducts, maxPage, productCountPerPage, setProductList: setVisibleProductList, fetchingByProductListRowIndex, productCountPerRow, flexDirection, productWidth, productHeight, productStyle, }: InfiniteScrollInfo) => import("react/jsx-runtime").JSX.Element;
export default InfiniteScroll;
