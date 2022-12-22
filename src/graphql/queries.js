import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
// before using apollo client
// import { request, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

// create new ApolloClient and pass in uri, and cache
const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  // configure options for all queries
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   mutate: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export async function getJobs() {
  const query = gql`
    query JobsQuery {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  // using apolloclient to make requests to server, replacing request fn
  // destructure jobs from returned data object
  const {
    data: { jobs },
  } = await client.query({
    query,
    fetchPolicy: "network-only",
  });

  return jobs;

  // before using ApolloClient
  // destructure jobs from data object
  //    const { jobs } = await request(GRAPHQL_URL, query);
  //  return jobs;
}

export async function getJob(id) {
  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });

  return job;

  // before using ApolloClient
  // destructure job from data object
  // const { job } = await request(GRAPHQL_URL, query, variables);
  // return job;
}

export async function getCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          title
        }
      }
    }
  `;
  const variables = { id };
  const {
    data: { company },
  } = await client.query({ query, variables });
  return company;

  // before using ApolloClient
  // destructure company from data object
  // const { company } = await request(GRAPHQL_URL, query, variables);
  // return company;
}

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `;
  const variables = { input };
  // create context object with http request headers
  const context = {
    headers: { Authorization: "Bearer " + getAccessToken() },
  };
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    // logic to be executed after successful mutation
    // update data in the cache after successful mutation.
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

  // before using ApolloClient
  // destructure job from data object
  // const headers = { Authorization: "Bearer " + getAccessToken() };
  // const { job } = await request(GRAPHQL_URL, query, variables, headers);
  // return job;
}

// export async function updateJob({id, title, description, companyId}) {
//   const query = gql`
//   mutation {
//     job: updateJob() {
//       id
//       company {
//         name
//       }
//       description
//       title
//     }
//   }
//   `;
//   const variables = { id, title, description, companyId };

//   // destructure job from data object
//   const { job } = await request(GRAPHQL_URL, query, variables);
//   return job;
// }
