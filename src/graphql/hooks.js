import { useMutation, useQuery } from "@apollo/client";
import { getAccessToken } from "../auth";
import {
  JOBS_QUERY,
  JOB_QUERY,
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
} from "./queries";

export function useJobs() {
  const query = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });
  // destructure query object
  const { data, loading, error } = query;
  return {
    jobs: data?.jobs,
    loading,
    // convert error object to boolean
    error: Boolean(error),
  };
}

export function useJob(id) {
  const query = useQuery(JOB_QUERY, {
    variables: { id },
  });
  // destructure query object
  const { data, loading, error } = query;
  return {
    job: data?.job,
    loading,
    // convert error object to boolean
    error: Boolean(error),
  };
}

export function useCompany(id) {
  const query = useQuery(COMPANY_QUERY, {
    variables: { id },
  });
  // destructure query object
  const { data, loading, error } = query;
  return {
    company: data?.company,
    loading,
    // convert error object to boolean
    error: Boolean(error),
  };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);

  return {
    createJob: async (title, description) => {
      const {
        data: { job },
      } = await mutate({
        variables: {
          input: { title, description },
        },
        context: {
          headers: { Authorization: "Bearer " + getAccessToken() },
        },
        update: (cache, result) => {
          // destructure result object
          const {
            data: { job },
          } = result;
          // update cache after job creation
          cache.writeQuery({
            query: JOB_QUERY,
            variables: { id: job.id },
            data: { job },
          });
        },
      });

      return job;
    },
    loading,
    error: Boolean(error),
  };
}
