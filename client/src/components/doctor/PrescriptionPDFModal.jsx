import React, { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FiX, FiDownload, FiPrinter, FiAlertTriangle } from "react-icons/fi";
import Spinner from "../common/Spinner";
import PrescriptionPDF from "./PrescriptionPDF";

const buildFileName = (prescription, patient) => {
  const namePart = (patient?.user?.name || "patient").replace(/\s+/g, "_");
  const datePart = prescription?.createdAt
    ? new Date(prescription.createdAt).toISOString().split("T")[0]
    : "prescription";
  return `Prescription_${namePart}_${datePart}.pdf`;
};

const PrescriptionPDFModal = ({ prescription, patient, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    const generatePdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const blob = await pdf(
          <PrescriptionPDF prescription={prescription} patient={patient} />
        ).toBlob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error("Error generating prescription PDF:", err);
        if (!cancelled) {
          setError("Failed to generate the PDF. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    generatePdf();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [prescription, patient]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = buildFileName(prescription, patient);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;
    iframeWindow.focus();
    iframeWindow.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Prescription PDF</h2>
              <p className="text-white/90 text-sm">
                Preview, print, or download this prescription
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                disabled={loading || !!error}
                title="Print prescription"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiPrinter className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownload}
                disabled={loading || !!error}
                title="Download prescription"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiDownload className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onClose}
                title="Close"
                className="p-2 rounded-full hover:bg-white/15 transition-colors flex items-center justify-center w-9 h-9">
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-gray-100 overflow-hidden">
          {loading && (
            <div className="h-full flex items-center justify-center">
              <Spinner
                size="large"
                variant="primary"
                showText
                text="Generating PDF..."
              />
            </div>
          )}
          {!loading && error && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <FiAlertTriangle className="w-12 h-12 text-red-400 mb-3" />
              <p className="text-gray-700 font-semibold">{error}</p>
            </div>
          )}
          {!loading && !error && blobUrl && (
            <iframe
              ref={iframeRef}
              src={blobUrl}
              title="Prescription PDF Preview"
              className="w-full h-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPDFModal;
