import { useEffect } from "react";
import { JobDetails } from "../components/JobDetails/JobDetails";
import { JobsList } from "../components/JobsList/JobsList";
import { DevTools } from "../components/DevTools/DevTools";
import { useJobPolling } from "../hooks/useJobPolling";
import { useJobsStore } from "../store/jobs-store";
import { CreateJobForm } from "../components/CreateJobForm/CreateJobForm";

export function JobsPage() {
  const jobs = useJobsStore((state) => state.jobs);
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const activeJob = useJobsStore((state) => state.activeJob);
  const isLoading = useJobsStore((state) => state.isLoading);
  const error = useJobsStore((state) => state.error);

  const loadJobs = useJobsStore((state) => state.loadJobs);
  const refreshJobs = useJobsStore((state) => state.refreshJobs);
  const selectJob = useJobsStore((state) => state.selectJob);
  const createNewJob = useJobsStore((state) => state.createNewJob);
  const cancelActiveJob = useJobsStore((state) => state.cancelActiveJob);

  useJobPolling();

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const hasUnsettledJobs = jobs.some(
    (job) => job.status === 'pending' || job.status === 'in_progress',
  );

  useEffect(() => {
    if (!hasUnsettledJobs) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshJobs();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [hasUnsettledJobs, refreshJobs]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-4 px-4 py-8">
      <header>
        <h1 className="font-display text-3xl text-brown-dark">URL Checker</h1>
        <p className="text-sm text-brown">Asynchronous URL health-check service</p>
      </header>

      {error && (
        <div className="border-2 border-retro-red bg-retro-red/10 px-4 py-2 text-sm text-retro-red">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <CreateJobForm onSubmit={createNewJob} />

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <JobsList jobs={jobs} activeJobId={activeJobId} onSelect={selectJob} />

            <JobDetails
              job={activeJob}
              isLoading={isLoading}
              onCancel={cancelActiveJob}
            />
          </section>
        </div>

        <div className="lg:sticky lg:top-8">
          <DevTools />
        </div>
      </div>
    </main>
  );
}
