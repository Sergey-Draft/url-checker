import { useState } from 'react';

interface CreateJobFormProps {
  onSubmit: (urls: string[]) => Promise<void>;
}

export function CreateJobForm({
  onSubmit,
}: CreateJobFormProps) {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const urls = value
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(urls);
      setValue('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter one URL per line"
        rows={8}
      />

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Checking...' : 'Start checking'}
      </button>
    </form>
  );
}