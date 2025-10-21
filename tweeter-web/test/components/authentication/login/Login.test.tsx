import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import {render, screen} from "@testing-library/react"
import { AuthMessages} from "../../../../src/presenter/AuthPresenter";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"


describe("Login Component", () => {
    //thought of doing it this way but changed my mind 

    // let user: ReturnType<typeof userEvent.setup>;
    // let signInButton: HTMLElement;
    // let aliasField: HTMLInputElement;
    // let passwordField: HTMLInputElement;

    // beforeEach(()=>{
    //     const {presenterFactory} = makePresenterFactory();
    //     ({user, signInButton, aliasField, passwordField} = renderLoginAndGetElements(presenterFactory));
    // });

    it("starts with the sign-in button disabled", () => {
        const { presenterFactory, doLogin } = makePresenterFactory();
        const { user, aliasField, passwordField, signInButton } =
          renderLoginAndGetElements(presenterFactory);
        expect(signInButton).toBeDisabled();
    })

    it("enables the sign-in button if both alias and password fields have text", async () => {
        const { presenterFactory, doLogin } = makePresenterFactory();
        const { user, aliasField, passwordField, signInButton } =
          renderLoginAndGetElements(presenterFactory);
        await signInAndType(user, aliasField, passwordField, signInButton)
    })

    it("disables the sign-in button if either the alias or password are cleared", async () => {
        const { presenterFactory, doLogin } = makePresenterFactory();
        const { user, aliasField, passwordField, signInButton } =
          renderLoginAndGetElements(presenterFactory);

        await signInAndType(user, aliasField, passwordField, signInButton)

        await user.clear(aliasField)
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "a")
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField)
        expect(signInButton).toBeDisabled();
    })

    it("calls the presenter's logic with correct parameters when the sign-in button is pressed", async () => {
        const { presenterFactory, doLogin } = makePresenterFactory();
        const {
          user: localUser,
          aliasField: localAlias,
          passwordField: localPassword,
          signInButton: localButton,
        } = renderLoginAndGetElements(presenterFactory);
    
        await localUser.type(localAlias, "correctalias");
        await localUser.type(localPassword, "correctpassword");
        expect(localButton).toBeEnabled();
    
        await localUser.click(localButton);
        expect(doLogin).toHaveBeenCalledWith(
          "correctalias",
          "correctpassword",
          false,
          undefined // unless you pass originalUrl
        );
    })
})

async function signInAndType(user: ReturnType<typeof userEvent.setup>, aliasField: HTMLInputElement, passwordField: HTMLInputElement, signInButton: HTMLElement){
    await user.type(aliasField, "a")
    await user.type(passwordField, "b")
    expect(signInButton).toBeEnabled();
}

function makePresenterFactory() {
    const doLogin = jest.fn().mockResolvedValue(undefined);
    const fakePresenter = { doLogin } as unknown as LoginPresenter;
    const presenterFactory = (_view: AuthMessages) => fakePresenter;
    return { presenterFactory, doLogin };
  }

function renderLogin(presenterFactory: (view: AuthMessages) => LoginPresenter){
    return render(
        <MemoryRouter>
            <Login presenterFactory={presenterFactory} />
        </MemoryRouter>
    );
}

function renderLoginAndGetElements(presenterFactory: (view: AuthMessages) => LoginPresenter ){
    const user = userEvent.setup();

    renderLogin(presenterFactory);

    const signInButton = screen.getByRole("button", {name : /Sign in/i}) as HTMLButtonElement;
    const aliasField = screen.getByLabelText(/alias/i) as HTMLInputElement;
    const passwordField = screen.getByLabelText(/password/i) as HTMLInputElement;

    return {user, signInButton, aliasField, passwordField}
}