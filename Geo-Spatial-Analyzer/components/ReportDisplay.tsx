import React from 'react';
import { AnalysisReport } from '../types';
import { DocumentTextIcon, ExclamationTriangleIcon, CheckCircleIcon } from './icons/Icons';

interface ReportDisplayProps {
  report: AnalysisReport | null;
  error: string | null;
  isStreaming: boolean;
}

const BlinkingCursor = () => (
    <span className="animate-pulse inline-block w-2 h-5 bg-cyan-400 ml-1" />
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, error, isStreaming }) => {
    if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-400">Analysis Error</h3>
        <p className="mt-2 text-gray-400 max-w-md">{error}</p>
      </div>
    );
  }
  
  if (!report && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <DocumentTextIcon className="w-12 h-12 text-gray-500" />
        <h3 className="mt-4 text-xl font-semibold text-white">Analysis Report</h3>
        <p className="mt-2 text-gray-400">Your generated report will appear here.</p>
        <p className="mt-1 text-gray-500">Upload an image and define boundary coordinates to begin.</p>
      </div>
    );
  }

  // A simple markdown-to-html converter
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-cyan-300">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-semibold mt-5 mb-2 text-cyan-400">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-cyan-400">{line.substring(2)}</h1>;
        if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
            const content = line.startsWith('- ') ? line.substring(2) : line.replace(/^\d+\.\s/, '');
            return (
                <li key={index} className="flex items-start my-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{content}</span>
                </li>
            );
        }
        if (line.trim() === '') return <br key={index} />;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={index} className="font-bold text-gray-200 my-2">{line.substring(2, line.length - 2)}</p>
        return <p key={index} className="text-gray-300 my-2">{line}</p>;
      });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4 sticky top-0 bg-gray-800 py-2 border-b border-gray-700 flex items-center">
        {report?.title || 'Generating Report...'}
        {isStreaming && <div className="ml-auto w-4 h-4 bg-red-500 rounded-full animate-pulse" title="Live"></div>}
      </h2>
      <div className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 max-w-none overflow-y-auto h-[calc(100%-50px)] pr-2">
        {report && renderMarkdown(report.content)}
        {isStreaming && <BlinkingCursor />}
      </div>
    </div>
  );
};

export default ReportDisplay;