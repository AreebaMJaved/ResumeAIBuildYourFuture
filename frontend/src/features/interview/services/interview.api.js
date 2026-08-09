// src/services/interview.api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/**
 * @route  POST /api/interview/
 * @desc   Generate interview report (resume upload + job/self description)
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append('jobDescription', jobDescription);
  formData.append('selfDescription', selfDescription);
  if (resumeFile) formData.append('resume', resumeFile);   // guard: field is optional when selfDesc provided

  const response = await api.post('/api/interview/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * @route  GET /api/interview/report/:interviewId
 * @desc   Get single interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/**
 * @route  GET /api/interview/
 * @desc   Get all interview reports for logged-in user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get('/api/interview/');
  return response.data;
};

/**
 * @route  POST /api/interview/resume/pdf/:interviewReportId
 * @desc   Download generated resume as PDF blob
 */
export const generateInterviewReportPdf  = async ({ interviewReportId }) => {
  const response = await api.post(
    `/api/interview/resume/pdf/${interviewReportId}`,
    null,
    { responseType: 'blob' },
  );
  return response.data;
};