import { useState, type FormEvent, type JSX } from "react";

import { validateLoginValues } from "../services/authenticationService";
import type { LoginFormProps, LoginFormValues } from "../types/authentication.types";
import { PixelButton } from "../../../components/PixelButton";

export function LoginForm(props: LoginFormProps): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values: LoginFormValues = { email, password };
    const validation = validateLoginValues(values);

    if (!validation.isValid) {
      setFormError(validation.errors.join(" "));
      return;
    }

    setFormError(null);
    await props.onSubmit(validation.normalizedValues);
  }

  return (
    <form className="grid gap-6 font-['Press_Start_2P'] w-full" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">EMAIL</span>
        <input
          className="w-full h-14 border-4 border-black bg-white px-3 text-[14px] text-black outline-none focus:bg-[#fff9c4] shadow-[8px_8px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[6px_6px_0_0_#000] transition-all"
          autoComplete="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="grid gap-2 text-[12px] text-black">
        <span className="uppercase tracking-wider">PASSWORD</span>
        <input
          className="w-full h-14 border-4 border-black bg-white px-3 text-[14px] text-black outline-none focus:bg-[#fff9c4] shadow-[8px_8px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[6px_6px_0_0_#000] transition-all"
          autoComplete="current-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {formError ? (
        <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]" role="alert">
          {formError}
        </p>
      ) : null}

      {props.error ? (
        <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]" role="alert">
          {props.error}
        </p>
      ) : null}

      <PixelButton
        variant="primary"
        type="submit"
        disabled={props.isSubmitting}
        className="w-full mt-2 h-14"
      >
        {props.isSubmitting ? "LOADING" : "START"}
      </PixelButton>
    </form>
  );
}
