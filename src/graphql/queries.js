import { gql } from "@apollo/client";
import { request } from "graphql-request";
// before installing apollo client
// import { request, gql } from "graphql-request";
import { getAccessToken } from "../auth";

const GRAPHQL_URL = "http://localhost:9000/graphql";

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;
  const variables = { id };

  // destructure job from data object
  const { job } = await request(GRAPHQL_URL, query, variables);
  return job;
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

  // destructure company from data object
  const { company } = await request(GRAPHQL_URL, query, variables);
  return company;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `;

  // destructure jobs from data object
  const { jobs } = await request(GRAPHQL_URL, query);
  return jobs;
}

export async function createJob(input) {
  const query = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        # we only need the job id in the response so we can return just the id to reduce the response object
        # title
        # company {
        #   id
        #   name
        # }
      }
    }
  `;
  const variables = { input };
  const headers = { Authorization: "Bearer " + getAccessToken() };

  // destructure job from data object
  const { job } = await request(GRAPHQL_URL, query, variables, headers);
  return job;
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
