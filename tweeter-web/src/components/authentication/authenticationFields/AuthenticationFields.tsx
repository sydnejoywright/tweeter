import { useState } from "react";

interface Props{
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
    onAliasChange: (v: string) => void;
    onPasswordChange: (v: string) => void;
}

const AuthenticationFields= (props : Props) => {
      const [alias, setAlias] = useState("");
      const [password, setPassword] = useState("");

    return(
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={props.onKeyDown}
            onChange={(event) => { setAlias(event.target.value); props.onAliasChange(event.target.value);}}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={props.onKeyDown}
            onChange={(event) => {setPassword(event.target.value); props.onPasswordChange(event.target.value)}}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
}

export default AuthenticationFields;
