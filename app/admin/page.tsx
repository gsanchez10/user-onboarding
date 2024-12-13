"use client";
import { Button, Select, Table } from "flowbite-react";
import Message, { ResultType } from "onboarding/components/Message";
import Loading from "onboarding/components/Loading";
import useFields from "onboarding/hooks/useFields";
import { GENERIC_ERROR } from "onboarding/lib/constants";
import { useCallback, useEffect, useState } from "react";
import { handleUpdateFields } from "onboarding/app/actions";

export default function Admin() {
  const { fields, isLoading: isLoadingFields } = useFields();
  const [editedFields, setEditedFields] = useState(fields);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { setEditedFields(fields) }, [fields]);

  useEffect(() => {
    const uniqueSteps = [1, 2];
    const stepsWithFields = uniqueSteps.filter((step) => editedFields.some((field) => field.step === step));
    if (uniqueSteps.length !== stepsWithFields.length) {
      setError("Each step must have at least one field");
    } else {
      setError("");
    }
  }, [editedFields]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const response = await handleUpdateFields(editedFields);
    if (!response.success) {
      setError(response.errorMessage || GENERIC_ERROR);
    }
    setIsSaving(false);
  }, [editedFields]);

  const handleStepChange = useCallback((fieldId: string, step: string) => {
    setEditedFields(editedFields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, step: parseInt(step) };
      }
      return field;
    }));
  }, [editedFields]);

  if (isLoadingFields) {
    return <Loading />;
  }

  return <form className="flex max-w-md flex-col gap-4 min-w-96" onSubmit={handleSubmit}>
    <Table>
      <Table.Head>
        <Table.HeadCell>Field</Table.HeadCell>
        <Table.HeadCell>Step</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {editedFields.map((field) => {
          return (
            <Table.Row key={field.id}>
              <Table.Cell>{field.label}</Table.Cell>
              <Table.Cell>
                <Select required value={field.step} onChange={(event) => handleStepChange(field.id, event.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Select>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
    <Message message={error} type={ResultType.ERROR} />
    {isSaving ? <Loading /> : <Button disabled={!!error} type="submit">Save</Button>}
  </form >;
}

