"use client";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useCallback, useState } from "react";
import { handleCreateUser } from "onboarding/app/actions";
import { useRouter } from "next/navigation";
import { GENERIC_ERROR } from "onboarding/lib/constants";
import Message, { ResultType } from "onboarding/components/Message";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const { success, data, errorMessage } = await handleCreateUser({ email, password });
    if (!success) {
      setError(errorMessage || GENERIC_ERROR);
    }

    if (data) {
      localStorage.setItem('user', data.id);
      router.push('/1');
    }
  }, [email, password, router]);

  return (
    <Card className="max-w-md min-w-96">
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput value={email} onChange={handleEmailChange} id="email1" type="email" placeholder="name@flowbite.com" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            value={password}
            onChange={handlePasswordChange}
            id="password1"
            type="password"
            required
          />
        </div>
        <div>
          {error ? <Message message={error} type={ResultType.ERROR} /> : null}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
}
