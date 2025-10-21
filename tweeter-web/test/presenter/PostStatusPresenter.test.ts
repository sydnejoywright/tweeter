import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView} from "../../src/presenter/PostStatusPresenter";
import {anything, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
import StatusService from "../../src/model.service/StatusService";

let mockPostStatusView: PostStatusView;
let postStatusPresenter: PostStatusPresenter;
const authToken = new AuthToken("abc123", Date.now());
const currentUser = new User("sydne", "wright", "imsydne", "111")
const post = "my new post"
const newStatus = new Status(post, currentUser, Date.now())
let mockService: StatusService;

beforeEach(()=>{
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("messageId123")

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();

    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
})
describe("PostStatusPresenter", () => {
    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(post, currentUser, authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    })

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(post, currentUser, authToken);
        verify(mockService.postStatus(authToken, anything())).once(); // figure out how to check the status as well instead of anything()
        
        //for use later if helpfuls
        // let [capturedAuthToken] = capture(mockService.logout)last();
        // expect(capturedAuthToken).toEqual(authToken)

    })

    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message when successful", async () => {
        await postStatusPresenter.submitPost(post, currentUser, authToken);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.deleteMessage(anything())).once();
        verify(mockPostStatusView.displayErrorMessage(anything())).never()

    })

    it("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message when not successfull", async () => {
        let error = new Error("an error occured")
        when(mockService.postStatus(authToken, anything())).thenThrow(error)
        await postStatusPresenter.submitPost(post, currentUser, authToken);
        verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: Error: an error occured`)).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();

    })
})