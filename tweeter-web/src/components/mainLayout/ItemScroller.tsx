import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoHooks, useUserInfoActionsHooks } from "../userInfo/UserInfoHooks";
import { PagedItemView } from "../../presenter/PagedItemPresenter";

interface ItemScrollerProps<T, P> {
  featureURL: string;
  presenterFactory: (view: PagedItemView<T>) => P;
  itemComponentFactory: (item: T, featurePath: string) => JSX.Element;
}

const ItemScroller = < T, P extends {
    hasMoreItems: boolean;
    reset(): void;
    loadMoreItems(authToken: any, alias: string): Promise<void>;
    getUser(authToken: any, alias: string): Promise<any>;
  }
>(props: ItemScrollerProps<T, P> ) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);

  const { displayedUser, authToken } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems: T[]) => setItems((prev) => [...prev, ...newItems]),
    displayErrorMessage,
  };

  const presenterRef = useRef<P | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUser &&
      displayedUserAliasParam !== displayedUser.alias
    ) {
      presenterRef.current!
        .getUser(authToken, displayedUserAliasParam)
        .then((toUser) => {
          if (toUser) setDisplayedUser(toUser);
        });
    }
  }, [authToken, displayedUserAliasParam, displayedUser, setDisplayedUser]);

  useEffect(() => {
    if (displayedUser) {
      reset();
      loadMoreItems();
    }
  }, [displayedUser]);

  const reset = async () => {
    setItems([]);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    await presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemComponentFactory(item, props.featureURL)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
