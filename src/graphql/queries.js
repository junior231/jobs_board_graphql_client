import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

// developement ENV
// const GRAPHQL_URL = "http://localhost:9000/graphql";

const GRAPHQL_URL = "https://jobboardserver.herokuapp.com/";

// create new ApolloClient and pass in uri, and cache
export const client = new ApolloClient({
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

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql`
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

export const COMPANY_QUERY = gql`
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

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

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
