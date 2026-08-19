import { useEffect } from "react";
import { JobDetails } from "../components/JobDetails/JobDetails";
import { JobsList } from "../components/JobsList/JobsList";
import { useJobPolling } from "../hooks/useJobPolling";
import { useJobsStore } from "../store/jobs-store";
import { CreateJobForm } from "../components/CreateJobForm/CreateJobForm";

export function JobsPage() {
  const jobs = useJobsStore((state) => state.jobs);
  const activeJobId = useJobsStore((state) => state.activeJobId);
  const activeJob = useJobsStore((state) => state.activeJob);
  const isLoading = useJobsStore((state) => state.isLoading);

  const loadJobs = useJobsStore((state) => state.loadJobs);
  const selectJob = useJobsStore((state) => state.selectJob);
  const createNewJob = useJobsStore((state) => state.createNewJob);
  const cancelActiveJob = useJobsStore((state) => state.cancelActiveJob);

  useJobPolling();

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <main>
      <h1>URL Checker</h1>

      <CreateJobForm onSubmit={createNewJob} />

      <section>
        <JobsList jobs={jobs} activeJobId={activeJobId} onSelect={selectJob} />

        <JobDetails
          job={activeJob}
          isLoading={isLoading}
          onCancel={cancelActiveJob}
        />
      </section>
    </main>
  );
}
