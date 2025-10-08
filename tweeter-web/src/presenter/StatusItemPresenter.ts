import { AuthToken, FakeData, Status, User} from "tweeter-shared";
import StatusService from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";

export interface StatusItemView{
    addItems: (items: Status[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class StatusItemPresenter{
    private _view: StatusItemView;
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;
    private _pageSize: number | null = null;
    private statusService: StatusService;
    private userService: UserService;

    
    protected constructor(view: StatusItemView){
        this._view = view;
        this.statusService = new StatusService();
        this.userService = new UserService();

    }
    protected get view () {
        return this._view;
    }

    protected get lastItem () {
        return this._lastItem;
    }

    protected get pageSize() {
        return this._pageSize;
    }

    protected set lastItem(value: Status | null){
        this._lastItem = value;
    }

    protected set hasMoreItems(value: boolean){
        this._hasMoreItems = value;
    }

    public get hasMoreItems(){
        return this._hasMoreItems;
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias)
    };

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string, itemDescription: string): Promise<void>;
}