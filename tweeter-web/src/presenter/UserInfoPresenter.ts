import { AuthToken, User } from "tweeter-shared";
import UserService from "../model.service/UserService";
import FollowService from "../model.service/FollowService";

export interface UserInfoView{
    displayErrorMessage: (message: string) => void;
    deleteMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    setLoading: (loading: boolean) => void;
    setIsFollower: (value: boolean) => void;
    setFollowerCount: (n: number) => void;
    setFolloweeCount: (n: number) => void;


    authToken: () => AuthToken;
    currentUser: () => User;
    displayedUser: () => User;
}


export class UserInfoPresenter{
    private _view: UserInfoView;
    private followService: FollowService;

    public constructor(view: UserInfoView, followService = new FollowService()){
        this._view = view;
        this.followService = followService;
    }
    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this._view.setIsFollower(false);
          } else {
            this._view.setIsFollower(
              await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`,
          );
        }
      };
    
      public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this._view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`,
          );
        }
      };
    
      public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
      ) {
        try {
          this._view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`,
          );
        }
      };

      public async followDisplayedUser(
        event: React.MouseEvent
      ): Promise<void> {
        event.preventDefault();
    
        var followingUserToast = "";
    
        try {
          this._view.setLoading(true);
          followingUserToast = this._view.displayInfoMessage!(
            `Following ${this._view.displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.follow(
            this._view.authToken(),
            this._view.displayedUser()
          );
    
          this._view.setIsFollower(true);
          this._view.setFollowerCount(followerCount);
          this._view.setFolloweeCount(followeeCount);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`,
          );
        } finally {
          this._view.deleteMessage(followingUserToast);
          this._view.setLoading(false);
        }
      };

      public async unfollowDisplayedUser (
        event: React.MouseEvent
      ): Promise<void> {
        event.preventDefault();
    
        var unfollowingUserToast = "";
    
        try {
          this._view.setLoading(true);
          unfollowingUserToast = this._view.displayInfoMessage(
            `Unfollowing ${this._view.displayedUser!.name}...`,
            0
          );
    
          const [followerCount, followeeCount] = await this.followService.unfollow(
            this._view.authToken(),
            this._view.displayedUser()
          );
    
          this._view.setIsFollower(false);
          this._view.setFollowerCount(followerCount);
          this._view.setFolloweeCount(followeeCount);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`,
          );
        } finally {
          this._view.deleteMessage(unfollowingUserToast);
          this._view.setLoading(false);
        }
      };

      
    
}