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
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfoHooks } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StatusItemView } from "./presenter/StatusItemPresenter";

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
        <Route path="feed/:displayedUser" element={<StatusItemScroller key = {`feed-${displayedUser!.alias}`} itemDescription="feed" featureURL="/feed" presenterFactory={(view: StatusItemView) => new FeedPresenter(view) }/>} />
        <Route path="story/:displayedUser" element={<StatusItemScroller key = {`story-${displayedUser!.alias}`} itemDescription="story" featureURL="/story" presenterFactory={(view: StatusItemView) => new StoryPresenter(view)}/>} />
        <Route path="followees/:displayedUser" element={<UserItemScroller key = {`followees-${displayedUser!.alias}`}  featureURL="/followees" presenterFactory={(view: UserItemView) => new FolloweePresenter(view) }/>} />
        <Route path="followers/:displayedUser" element={<UserItemScroller key = {`followers-${displayedUser!.alias}`}  featureURL="/followers" presenterFactory={(view: UserItemView) => new FollowerPresenter(view)}/>} />
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
