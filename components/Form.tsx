"use client";
import { Button, Card, Datepicker, Label, TextInput } from "flowbite-react";

import useFields from "onboarding/hooks/useFields";
import Loading from "onboarding/components/Loading";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { handleFetchUser, handleUpdateOrCreateUser } from "onboarding/app/actions";
import { GENERIC_ERROR } from "onboarding/lib/constants";
import { ResultType } from "onboarding/components/Message";
import { useRouter } from "next/navigation";
import Message from "onboarding/components/Message";
import { User } from "@prisma/client";

const COMPONENTS_MAP = {
  text: { component: TextInput, defaultValue: '' },
  date: { component: Datepicker, defaultValue: new Date() }
};

export default function Form({ step }: { step: number }) {
  const { fields, isLoading: isLoadingFields } = useFields(step);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      const userId = localStorage.getItem('user') ?? '';
      const { data } = await handleFetchUser(userId);
      if (data) {
        setUser(data);
        setIsLoadingUser(false);
      } else {
        router.push('/');
      }
    };
    fetchUser();
  }, [router]);

  const handleFieldChange = useCallback((field: string, e: ChangeEvent<HTMLInputElement> | null | Date) => {
    setError("");
    const value = e instanceof Date ? e : e?.target?.value;

    setUser((prev) => prev ? ({ ...prev, [field as keyof User]: value }) : null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      setSuccessMessage("");
      setError("");
      setIsSaving(true);
      const response = await handleUpdateOrCreateUser(user);
      if (!response.success) {
        setError(response.errorMessage || GENERIC_ERROR);
      } else if (step === 2) {
        setSuccessMessage('Thanks, user onboarded successfully!');
      }
      if (step === 1) {
        router.push('/2');
      } else {
        setIsSaving(false);
      }
    }
  }, [router, step, user]);

  const handleBack = useCallback(() => {
    router.push(`/${step === 1 ? '/' : step - 1}`);
  }, [router, step]);
  if (isLoadingFields || isLoadingUser) {
    return <Loading />;
  }
  return (
    <Card className="max-w-md min-w-96">
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
        {
          fields.map((field) => {
            const componentOpts = COMPONENTS_MAP[field.type as keyof typeof COMPONENTS_MAP];
            const Component = componentOpts?.component;
            const defaultValue = componentOpts?.defaultValue;
            const value = user?.[field.name as keyof User] ?? defaultValue;
            return (
              <div key={field.id}>
                <div className="mb-2 block">
                  <Label htmlFor={field.id} value={field.label} />
                </div>
                <Component value={value as ((string | number | readonly string[]) & (Date | null)) | undefined} onChange={(e) => {
                  handleFieldChange(field.name, e)
                }} id={field.id} />
              </div>
            )
          })
        }
        <Message message={error} type={ResultType.ERROR} />
        <Message message={successMessage} type={ResultType.SUCCESS} />

        <Button type="button" onClick={handleBack}>Back</Button>
        {isSaving ? <Loading /> : <Button type="submit">{step === 1 ? 'Continue' : 'Submit'}</Button>}
      </form>
    </Card>
  );
}