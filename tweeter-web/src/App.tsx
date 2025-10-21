import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfoHooks } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter } from "./presenter/RegisterPresenter";
import { Status, User } from "tweeter-shared";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { AuthMessages } from "./presenter/AuthPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const makeStatusItemFactory = () => (status: Status, path: string) =>
  <StatusItem status={status} featurePath={path} />;

const makeUserItemFactory = () => (user: User, path: string) =>
  <UserItem user={user} featurePath={path} />;

const App = () => {
  const { currentUser, authToken } = useUserInfoHooks();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfoHooks();
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" 
          element={<ItemScroller<Status, FeedPresenter> 
          key = {`feed-${displayedUser!.alias}`}
          //itemDescription="feed" 
          featureURL="/feed" 
          presenterFactory={(view: PagedItemView<Status>) => new FeedPresenter(view) }
          itemComponentFactory={makeStatusItemFactory()}
          />} />
        <Route path="story/:displayedUser" 
          element={<ItemScroller<Status, StoryPresenter> 
          key = {`story-${displayedUser!.alias}`} 
          //itemDescription="story" 
          featureURL="/story" 
          presenterFactory={(view: PagedItemView<Status>) => new StoryPresenter(view)}
          itemComponentFactory={makeStatusItemFactory()}
          />} />
        <Route path="followees/:displayedUser" 
          element={<ItemScroller<User, FolloweePresenter> 
          key = {`followees-${displayedUser!.alias}`}  
          featureURL="/followees" 
          presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view) }
          itemComponentFactory={makeUserItemFactory()}
          />} />
        <Route path="followers/:displayedUser" 
          element={<ItemScroller<User, FollowerPresenter> 
          key = {`followers-${displayedUser!.alias}`}  
          featureURL="/followers" 
          presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)}
          itemComponentFactory={makeUserItemFactory()}
          />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login presenterFactory={(view: AuthMessages) => new LoginPresenter(view)}/>} />
      <Route path="/register" element={<Register presenterFactory={(view: AuthMessages) => new RegisterPresenter(view)}/>} />
      <Route path="*" element={<Login originalUrl={location.pathname} presenterFactory={(view: AuthMessages) => new LoginPresenter(view) } />} />
    </Routes>
  );
};

export default App;
