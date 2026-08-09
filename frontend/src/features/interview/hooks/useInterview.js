// src/hooks/useInterview.js
import { useContext } from 'react';
import { InterviewContext } from '../interview.context';
import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateInterviewReportPdf,
} from '../services/interview.api';

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

  /**
   * Generate a new interview report.
   * Returns the created interviewReport object so callers can navigate immediately.
   */
  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error('generateReport error:', error);
      throw error;                    // re-throw so Home.jsx catch block works
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single report by ID.
   * Called from Interview.jsx useEffect with the :interviewId param.
   */
  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error('getReportById error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all reports for the logged-in user.
   * Called from the dashboard (Home.jsx) on mount.
   */
  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (error) {
      console.error('getReports error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download the AI-generated resume as a PDF.
   */
  const getInterviewReportPdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const blob = await generateInterviewReportPdf({ interviewReportId });
      const url  = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview_report_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);   // clean up memory
    } catch (error) {
      console.error('getResumePdf error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, report, reports, generateReport, getReportById, getReports, getInterviewReportPdf };
};