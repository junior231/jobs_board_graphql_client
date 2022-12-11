import { useEffect, useState } from "react";
import JobList from "./JobList";
import { getJobs } from "../graphql/queries";

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // getJobs().then((jobs) => setJobs(jobs));

    // alternate/more concise way
    getJobs()
      .then(setJobs)
      .catch((err) => {
        setError(true);
      });
  }, []);

  if (error) {
    return <p>Sorry, something went wrong</p>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;