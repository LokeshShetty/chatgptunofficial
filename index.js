import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import fs from "fs";

const api = new ChatGPTUnofficialProxyAPI({
  accessToken:
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJsb2tlc2guczA5MDQyMDAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLVdGdHJSVmJqSWRXNkNMZTYzOFRISDd3VCJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTQxMDI3ODg3MzUzNTc2MDM0MzYiLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjc4OTYwMTU5LCJleHAiOjE2ODAxNjk3NTksImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb2ZmbGluZV9hY2Nlc3MifQ.JngvS7ANg01ggZWzf0Ot6e8E6ZzI-I_Z4Q7MxcsMU2CPtj0P0XY_xd-Fsxq4idPZV4xtWjTCkQevLc7DILb4J6aDYfykFbxe3yM5RW3wRAzB-0d4UvRPwRglbvaTfmzi2u9RxBtswsGHx7QVdFZXNebzWBAzSIiSzSnsRmEbvVO_rhZQmB5aezBZ8wxoHgZssZ-1_RR7NsOu48oRVZO2QvquHD_GYX2wvIkyIhYwGZYBdEKs_DZvZjmGecvLXiv7QgF5lOsQ8SJb3_H6bnUWDuM8j6v7sGFP074Kd5K7iRG71kwvVMntiWpQgkV34C7TGgzUbIvxdFyYv1CHopcPNA",
  apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
});

async function rewriteText(text) {
  const response = await api.sendMessage(text, {
    model: "text-rewrite",
    maxTokens: 500,
    temperature: 0.8,
    n: 1,
    stop: ["\n"],
  });
  console.log(response.text.trim());
}

rewriteText("suggest me food");
