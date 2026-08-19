import { useState } from 'react';
import { generateTestUrls } from '../../utils/generate-urls';

interface CreateJobFormProps {
  onSubmit: (urls: string[]) => Promise<void>;
}

const GENERATE_COUNTS = [10, 50, 100];

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
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="border-2 border-brown bg-paper-dark/40 p-4 shadow-[4px_4px_0_var(--color-brown)]"
    >
      <h2 className="mb-3 font-display text-lg text-brown-dark">New check</h2>

      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter one URL per line"
        rows={8}
        className="w-full resize-y border-2 border-brown bg-paper px-3 py-2 font-mono text-sm text-ink outline-none placeholder:text-brown/50 focus:border-retro-blue"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-xs text-brown">Test data:</span>
          {GENERATE_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setValue(generateTestUrls(count))}
              className="cursor-pointer border border-brown bg-paper px-2 py-1 text-xs text-brown-dark transition-colors hover:bg-mustard hover:text-ink"
            >
              Generate {count}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer border-2 border-brown-dark bg-mustard px-4 py-2 font-display text-sm text-ink shadow-[3px_3px_0_var(--color-brown-dark)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? 'Checking...' : 'Start checking'}
        </button>
      </div>
    </form>
  );
}
