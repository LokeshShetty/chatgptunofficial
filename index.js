import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { ChatGPTUnofficialProxyAPI, ChatGPTError } from "chatgpt";
import fs from "fs";

// Define the API endpoint and headers
const api = new ChatGPTUnofficialProxyAPI({
  accessToken:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJsb2tlc2guczA5MDQyMDAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLVdGdHJSVmJqSWRXNkNMZTYzOFRISDd3VCJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTQxMDI3ODg3MzUzNTc2MDM0MzYiLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjc4OTYwMTU5LCJleHAiOjE2ODAxNjk3NTksImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb2ZmbGluZV9hY2Nlc3MifQ.JngvS7ANg01ggZWzf0Ot6e8E6ZzI-I_Z4Q7MxcsMU2CPtj0P0XY_xd-Fsxq4idPZV4xtWjTCkQevLc7DILb4J6aDYfykFbxe3yM5RW3wRAzB-0d4UvRPwRglbvaTfmzi2u9RxBtswsGHx7QVdFZXNebzWBAzSIiSzSnsRmEbvVO_rhZQmB5aezBZ8wxoHgZssZ-1_RR7NsOu48oRVZO2QvquHD_GYX2wvIkyIhYwGZYBdEKs_DZvZjmGecvLXiv7QgF5lOsQ8SJb3_H6bnUWDuM8j6v7sGFP074Kd5K7iRG71kwvVMntiWpQgkV34C7TGgzUbIvxdFyYv1CHopcPNA",
});

// Define the CSV input and output files
const inputFile = "FilteredData.csv";
const outputFile = "FinalData.csv";

// Define the CSV writer configuration
const csvWriter = createObjectCsvWriter({
  path: outputFile,
  header: [
    { id: "Category", title: "Category" },
    { id: "Title", title: "Title" },
    { id: "Description", title: "Description" },
    { id: "Tags", title: "Tags" },
    { id: "UpVotes", title: "UpVotes" },
    { id: "newTitle", title: "newTitle" },
    { id: "newDescription", title: "newDescription" },
  ],
});

// Define a function to make API requests to ChatGPTUnofficialProxyAPI
async function generateResponse(text) {
  try {
    const response = await api.sendMessage(text, {
      model: "text-rewrite",
    });
    return response;
  } catch (error) {
    if (error instanceof ChatGPTError && error.status === 429) {
      // Handle rate limiting error by waiting for the suggested duration and retrying
      console.warn(
        `Rate limited, waiting for ${error.retryAfterSeconds} seconds and retrying...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, error.retryAfterSeconds * 5000)
      );
      return await generateResponse(prompt);
    }
    // For any other errors, rethrow the error
    throw error;
  }
}

// Define the main function to read the CSV input file, make API requests for each row, and write to the CSV output file
async function run() {
  const results = [];
  const rows = [];

  // Read the CSV input file and push each row into an array
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (data) => {
      rows.push(data);
    })
    .on("end", async () => {
      // Iterate over each row, make API requests, and push the results into an array
      for (const data of rows) {
        const prompt = `rewrite the given title and description ${data["Title"]} + " " + ${data["Description"]} without changing the context in the title: and description: format`;
        const response = await new Promise((resolve) => {
          setTimeout(async () => {
            const result = await generateResponse(prompt);
            resolve(result);
          }, 2000);
        });
        console.log(response);
        results.push({
          ...data,
          newTitle: response.text,
          newDescription: response.text,
        });
      }
      // Write the results array to the CSV output file
      csvWriter
        .writeRecords(results)
        .then(() => console.log("The CSV file was written successfully"));
    });
}
run();
