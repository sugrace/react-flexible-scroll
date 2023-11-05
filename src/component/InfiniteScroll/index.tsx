import * as React from "react";
import { useState, useEffect, useCallback, JSXElementConstructor } from "react";

type CustomScrollEvent = {
  target: {
    scrollingElement: {
      scrollTop: number;
    };
  };
};

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
const INITIAL_PAGE_INDEX: number = 0;

const addedPageLength: { [key: number]: number } = {
  0: 0,
};

const throttle = (
  callback: (e: {
    target: { scrollingElement: { scrollTop: number } };
  }) => Promise<void>,
  delay: number
): (() => void) => {
  let timer: any;

  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        (callback as any)(...args);
        timer = undefined;
      }, delay);
    }
  };
};

const pageMap: { [key: number]: any[] } = {};
const requestedPageMap: { [key: number]: boolean } = {};

const InfiniteScroll = ({
  children,
  getProducts,
  maxPage,
  productCountPerPage,
  setProductList: setVisibleProductList,
  fetchingByProductListRowIndex = 3,
  productCountPerRow = 1,
  flexDirection,
  productWidth,
  productHeight = window.innerHeight / 4,
  productStyle,
}: InfiniteScrollInfo) => {
  let startRowIndex = 0;
  const visibleRowLength = productCountPerPage / productCountPerRow;
  const visibleListCapacity = visibleRowLength * productCountPerRow;
  const maximumRowLength = maxPage * visibleRowLength;
  const lastStartRowIndex = maximumRowLength - visibleRowLength;

  const LOADING_PRODUCT_LIST = Array.from(
    { length: visibleListCapacity },
    () => ({})
  );

  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(
    productHeight * (maximumRowLength - visibleRowLength)
  );

  const initialize = useCallback(async () => {
    const initialData = await getProducts(INITIAL_PAGE_INDEX);
    pageMap[INITIAL_PAGE_INDEX] = initialData;
    if (!document.documentElement.scrollTop) {
      setVisibleProductList(initialData);
    }
  }, [getProducts, setVisibleProductList]);

  const setVisibleProductListByStartRowIndex = useCallback(() => {
    const newStartIndex = startRowIndex * productCountPerRow;
    const newLastIndex =
      (startRowIndex + visibleRowLength - 1) * productCountPerRow;
    const currentFirstIndexPage = Math.floor(
      newStartIndex / visibleListCapacity
    );
    const currentLastIndexPage = Math.floor(newLastIndex / visibleListCapacity);
    const startIndexPerPage =
      newStartIndex - visibleListCapacity * currentFirstIndexPage;

    if (!pageMap[currentFirstIndexPage] && pageMap[currentLastIndexPage]) {
      setVisibleProductList(
        [...LOADING_PRODUCT_LIST, ...pageMap[currentLastIndexPage]].slice(
          startIndexPerPage,
          startIndexPerPage + visibleListCapacity
        )
      );
    } else if (
      pageMap[currentFirstIndexPage] &&
      !pageMap[currentLastIndexPage]
    ) {
      setVisibleProductList(
        [...pageMap[currentFirstIndexPage], ...LOADING_PRODUCT_LIST].slice(
          startIndexPerPage,
          startIndexPerPage + visibleListCapacity
        )
      );
    } else if (
      !pageMap[currentFirstIndexPage] &&
      !pageMap[currentLastIndexPage]
    ) {
      setVisibleProductList(LOADING_PRODUCT_LIST);
    } else {
      setVisibleProductList(
        [
          ...pageMap[currentFirstIndexPage],
          ...pageMap[currentLastIndexPage],
        ].slice(startIndexPerPage, startIndexPerPage + visibleListCapacity)
      );
    }
  }, [
    LOADING_PRODUCT_LIST,
    productCountPerRow,
    setVisibleProductList,
    startRowIndex,
    visibleListCapacity,
    visibleRowLength,
  ]);

  const getStartRowIndex = useCallback(
    (scrollTop: number) => {
      if (
        scrollTop <= addedPageLength[INITIAL_PAGE_INDEX] + productHeight ||
        scrollTop < 0
      ) {
        return INITIAL_PAGE_INDEX;
      }

      let startRowIndex = Math.floor(
        (scrollTop - addedPageLength[INITIAL_PAGE_INDEX]) / productHeight
      );

      if (startRowIndex > lastStartRowIndex) {
        startRowIndex = lastStartRowIndex;
      }
      return startRowIndex;
    },
    [lastStartRowIndex, productHeight]
  );

  const handleScrollLayout = async (e: CustomScrollEvent) => {
    const { scrollTop } = e.target.scrollingElement;
    startRowIndex = getStartRowIndex(
      scrollTop - productHeight * fetchingByProductListRowIndex
    );

    const newPaddingTop = productHeight * startRowIndex;
    const newPaddingBottom =
      productHeight * (maximumRowLength - visibleRowLength) - newPaddingTop;
    setPaddingTop(newPaddingTop);
    setPaddingBottom(newPaddingBottom);
    setVisibleProductListByStartRowIndex();
  };

  const handleScrollFetch = async (e: CustomScrollEvent) => {
    const { scrollTop } = e.target.scrollingElement;
    const startRowIndexAtScrollEnd = getStartRowIndex(
      scrollTop - productHeight * fetchingByProductListRowIndex
    );
    const newStartIndex = startRowIndex * productCountPerRow;
    const newLastIndex =
      (startRowIndex + visibleRowLength - 1) * productCountPerRow;
    const currentFirstIndexPage = Math.floor(
      newStartIndex / visibleListCapacity
    );
    const currentLastIndexPage = Math.floor(newLastIndex / visibleListCapacity);
    const startIndexPerPage =
      newStartIndex - visibleListCapacity * currentFirstIndexPage;

    let tempProductList = [];

    if (!pageMap[currentFirstIndexPage] && pageMap[currentLastIndexPage]) {
      if (!requestedPageMap[currentFirstIndexPage]) {
        requestedPageMap[currentFirstIndexPage] = true;
        pageMap[currentFirstIndexPage] = await getProducts(
          currentFirstIndexPage
        );
      } else {
        return;
      }
    } else if (
      pageMap[currentFirstIndexPage] &&
      !pageMap[currentLastIndexPage]
    ) {
      if (!requestedPageMap[currentLastIndexPage]) {
        requestedPageMap[currentLastIndexPage] = true;
        pageMap[currentLastIndexPage] = await getProducts(currentLastIndexPage);
      } else {
        return;
      }
    } else if (
      !pageMap[currentFirstIndexPage] &&
      !pageMap[currentLastIndexPage]
    ) {
      if (
        !requestedPageMap[currentFirstIndexPage] &&
        !requestedPageMap[currentLastIndexPage]
      ) {
        requestedPageMap[currentFirstIndexPage] = true;
        requestedPageMap[currentLastIndexPage] = true;
        [pageMap[currentFirstIndexPage], pageMap[currentLastIndexPage]] =
          await Promise.all([
            getProducts(currentFirstIndexPage),
            getProducts(currentLastIndexPage),
          ]);
      } else {
        return;
      }
    }
    if (currentFirstIndexPage !== currentLastIndexPage) {
      tempProductList = [
        ...pageMap[currentFirstIndexPage],
        ...pageMap[currentLastIndexPage],
      ];
      const newVisibleProductList = tempProductList.slice(
        startIndexPerPage,
        startIndexPerPage + visibleListCapacity
      );
      tempProductList = newVisibleProductList;
    } else {
      tempProductList = pageMap[currentFirstIndexPage];
    }
    if (startRowIndexAtScrollEnd === startRowIndex) {
      setVisibleProductListByStartRowIndex();
    } else {
      handleScrollFetch(e);
    }
  };

  useEffect(() => {
    const throttleHandleScrollFetch = throttle(handleScrollFetch, 500);
    const throttleHandleScrollLayout = throttle(handleScrollLayout, 0);

    document.addEventListener("scroll", throttleHandleScrollLayout);
    document.addEventListener("scroll", throttleHandleScrollFetch);

    initialize();

    return () => {
      document.removeEventListener("scroll", throttleHandleScrollLayout);
      document.removeEventListener("scroll", throttleHandleScrollFetch);
    };
  }, []);

  return (
    <div style={{ height: productHeight * maximumRowLength }}>
      <div
        style={{
          display: "flex",
          flexDirection,
          flexWrap: "wrap",
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
        }}
      >
        {React.Children.map(children, (child) => (
          <div
            style={{
              width: productWidth,
              height: productHeight,
              flex: `0 1 ${100 / productCountPerRow}%`,
              ...productStyle,
            }}
          >
            {React.cloneElement(child, { key: child.key })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
