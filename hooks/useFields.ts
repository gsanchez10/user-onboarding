import { useEffect, useState } from 'react';
import { fetchFields } from "onboarding/app/actions";
import { Field } from '@prisma/client';

const useFields = (step?: number | undefined) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFields(step)
      .then((fields) => {
        setFields(fields);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [step]);

  return { fields, isLoading, error };
}

export default useFields;
