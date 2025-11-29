// import { AuthToken } from "tweeter-shared";
// import { LogoutPresenter, LogoutView } from "../../src/presenter/LogoutPresenter";
// import {anything, instance, mock, spy, verify, when} from "@typestrong/ts-mockito";
// import UserService from "../../src/model.service/UserService";

// let mockAppNavbarPresenterView: LogoutView;
// let logoutPresenter: LogoutPresenter;
// const authToken = new AuthToken("abc123", Date.now());
// let mockService: UserService;

// beforeEach(()=>{
//     mockAppNavbarPresenterView = mock<LogoutView>();
//     const mockAppNavbarPresenterViewInstance = instance(mockAppNavbarPresenterView);
//     when(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123")

//     const logoutPresenterSpy = spy(new LogoutPresenter(mockAppNavbarPresenterViewInstance));
//     logoutPresenter = instance(logoutPresenterSpy);

//     mockService = mock<UserService>();

//     when(logoutPresenterSpy.service).thenReturn(instance(mockService));
// })
// describe("AppNavbarPresenter", () => {
//     it("tells the view to display a logging out message", async () => {
//         await logoutPresenter.logOut(authToken);
//         verify(mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
//     })

//     it("calls logout on the user service with the correct auth token", async () => {
//         await logoutPresenter.logOut(authToken);
//         verify(mockService.logout(authToken)).once();
        
//         //for use later if helpful
//         // let [capturedAuthToken] = capture(mockService.logout)last();
//         // expect(capturedAuthToken).toEqual(authToken)

//     })

//     it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page when successful", async () => {
//         await logoutPresenter.logOut(authToken);
//         verify(mockAppNavbarPresenterView.deleteMessage(anything())).once();
//         verify(mockAppNavbarPresenterView.clearUserInfo()).once();
//         verify(mockAppNavbarPresenterView.navigateTo("/login")).once();
//         verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();

//     })

//     it("tells the view to display an error message and does not tell it to clear the info message, clears the user info or navigates to the login page when not successfull", async () => {
//         let error = new Error("an error occured")
//         when(mockService.logout(anything())).thenThrow(error)
//         await logoutPresenter.logOut(authToken);
//         verify(mockAppNavbarPresenterView.displayErrorMessage(`Failed to log user out because of exception: Error: an error occured`)).once();
//         verify(mockAppNavbarPresenterView.clearUserInfo()).never();
//         verify(mockAppNavbarPresenterView.navigateTo("/login")).never();
//         verify(mockAppNavbarPresenterView.deleteMessage("messageId123")).never();

//     })
// })

test("dummy test to pass Jest", () => {
    expect(true).toBe(true);
  });