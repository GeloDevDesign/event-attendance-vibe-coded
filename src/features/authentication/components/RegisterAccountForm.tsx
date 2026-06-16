import { useState, type FormEvent, type JSX } from "react";

import type { Id } from "../../../../convex/_generated/dataModel";
import { CharacterSelector } from "../../characters/components/CharacterSelector";
import { useCharacters } from "../../characters/hooks/useCharacters";
import { validateRegisterAccountValues } from "../services/authenticationService";
import type {
  RegisterAccountFormProps,
  RegisterAccountFormValues,
} from "../types/authentication.types";
import { PixelButton } from "../../../components/PixelButton";

export function RegisterAccountForm(props: RegisterAccountFormProps): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCharacterId, setSelectedCharacterId] =
    useState<Id<"characters"> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { characters, isLoading: isLoadingCharacters, isEmpty } = useCharacters();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values: RegisterAccountFormValues = {
      name,
      email,
      password,
      selectedCharacterId,
    };
    const validation = validateRegisterAccountValues(values);

    if (!validation.isValid) {
      setFormError(validation.errors.join(" "));
      return;
    }

    setFormError(null);
    await props.onSubmit(validation.normalizedValues);
  }

  return (
    <form className="grid md:grid-cols-[1fr_320px] gap-10 font-['Press_Start_2P'] w-full" onSubmit={handleSubmit}>
      <section className="grid gap-6 content-start">
        <label className="grid gap-2 text-[12px] text-black">
          <span className="uppercase tracking-wider">NAME</span>
          <input
            className="w-full h-14 border-4 border-black bg-white px-3 text-[14px] text-black outline-none focus:bg-[#fff9c4] shadow-[8px_8px_0_0_#000] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[6px_6px_0_0_#000] transition-all"
            autoComplete="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

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
            autoComplete="new-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        
        <div className="hidden md:block grid gap-2 mt-4">
          {formError ? (
            <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000] mb-2" role="alert">
              {formError}
            </p>
          ) : null}
          {props.error ? (
            <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000] mb-2" role="alert">
              {props.error}
            </p>
          ) : null}

          <PixelButton
            variant="primary"
            type="submit"
            disabled={props.isSubmitting || isLoadingCharacters || isEmpty}
            className="w-full h-14"
          >
            {props.isSubmitting ? "LOADING" : "CREATE HERO"}
          </PixelButton>
        </div>
      </section>

      <section className="grid gap-4 content-start">
        <div className="grid gap-1 text-[12px] text-black">
          <span className="uppercase tracking-wider">CHOOSE HERO</span>
          <p className="text-[9px] leading-relaxed text-stone-700">
            Pick your avatar for the map.
          </p>
        </div>

        <div className="bg-[#ebd2a9] border-[6px] border-black p-4 shadow-[inset_6px_6px_0_rgba(0,0,0,0.1)] h-[250px] overflow-hidden">
          {isLoadingCharacters ? (
            <p className="text-[10px] text-black">
              Loading characters...
            </p>
          ) : (
            <CharacterSelector
              characters={characters}
              selectedCharacterId={selectedCharacterId ?? undefined}
              onSelect={setSelectedCharacterId}
            />
          )}
        </div>
        
        <div className="md:hidden grid gap-2 mt-4">
          {formError ? (
            <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000] mb-2" role="alert">
              {formError}
            </p>
          ) : null}
          {props.error ? (
            <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000] mb-2" role="alert">
              {props.error}
            </p>
          ) : null}

          <PixelButton
            variant="primary"
            type="submit"
            disabled={props.isSubmitting || isLoadingCharacters || isEmpty}
            className="w-full h-14"
          >
            {props.isSubmitting ? "LOADING" : "CREATE HERO"}
          </PixelButton>
        </div>
      </section>
    </form>
  );
}
