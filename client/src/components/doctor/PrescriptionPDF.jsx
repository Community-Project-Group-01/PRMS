import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const COLORS = {
  primary: "#129990",
  primaryDark: "#096b68",
  secondaryDark: "#90d1ca",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
  tableHeaderBg: "#129990",
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: COLORS.text,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: `2 solid ${COLORS.primary}`,
    paddingBottom: 12,
    marginBottom: 16,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.primaryDark,
  },
  clinicSub: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 2,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.primary,
    textAlign: "right",
  },
  docMeta: {
    fontSize: 9,
    color: COLORS.muted,
    textAlign: "right",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f0fdfb",
    borderRadius: 6,
    padding: 10,
    border: `1 solid ${COLORS.border}`,
  },
  infoBoxTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.primaryDark,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoLine: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: 70,
    color: COLORS.muted,
  },
  infoValue: {
    flex: 1,
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 8,
  },
  table: {
    borderRadius: 4,
    overflow: "hidden",
    border: `1 solid ${COLORS.border}`,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.tableHeaderBg,
  },
  tableHeaderCell: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderTop: `1 solid ${COLORS.border}`,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 9,
    padding: 6,
  },
  colDrug: { width: "28%" },
  colDosage: { width: "22%" },
  colDuration: { width: "18%" },
  colInstructions: { width: "32%" },
  emptyState: {
    padding: 16,
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 48,
  },
  signatureBox: {
    width: 180,
    textAlign: "center",
  },
  signatureLine: {
    borderTop: `1 solid ${COLORS.text}`,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 8,
    color: COLORS.muted,
  },
  disclaimer: {
    fontSize: 7,
    color: COLORS.muted,
    marginTop: 16,
    borderTop: `1 solid ${COLORS.border}`,
    paddingTop: 8,
    textAlign: "center",
  },
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateAge = (dob) => {
  if (!dob) return null;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

const PrescriptionPDF = ({ prescription, patient }) => {
  const items = prescription?.items || [];
  const patientName = patient?.user?.name || "Unknown Patient";
  const doctorName = prescription?.doctor?.user?.name || "N/A";
  const age = patient?.age ?? calculateAge(patient?.dob);

  return (
    <Document
      title={`Prescription - ${patientName}`}
      author="University Health System">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>University Health System</Text>
            <Text style={styles.clinicSub}>Patient Records &amp; Prescription Management</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>PRESCRIPTION</Text>
            <Text style={styles.docMeta}>
              ID: {prescription?._id?.slice(-10).toUpperCase() || "N/A"}
            </Text>
            <Text style={styles.docMeta}>
              Date: {formatDate(prescription?.createdAt)}
            </Text>
          </View>
        </View>

        {/* Patient & Doctor Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Patient Information</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{patientName}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>NIC</Text>
              <Text style={styles.infoValue}>{patient?.nic || "N/A"}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Age / Sex</Text>
              <Text style={styles.infoValue}>
                {age ?? "N/A"} {patient?.gender ? `/ ${patient.gender}` : ""}
              </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{patient?.contact || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>Prescribed By</Text>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Doctor</Text>
              <Text style={styles.infoValue}>Dr. {doctorName}</Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Specialization</Text>
              <Text style={styles.infoValue}>
                {prescription?.doctor?.specialization || "N/A"}
              </Text>
            </View>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>License No.</Text>
              <Text style={styles.infoValue}>
                {prescription?.doctor?.licenseNumber || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Medications */}
        <Text style={styles.sectionTitle}>Medications (Rx)</Text>
        {items.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, styles.colDrug]}>Drug Name</Text>
              <Text style={[styles.tableHeaderCell, styles.colDosage]}>Dosage</Text>
              <Text style={[styles.tableHeaderCell, styles.colDuration]}>Duration</Text>
              <Text style={[styles.tableHeaderCell, styles.colInstructions]}>Instructions</Text>
            </View>
            {items.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                ]}>
                <Text style={[styles.tableCell, styles.colDrug]}>{item.drug || "N/A"}</Text>
                <Text style={[styles.tableCell, styles.colDosage]}>{item.dosage || "N/A"}</Text>
                <Text style={[styles.tableCell, styles.colDuration]}>{item.duration || "N/A"}</Text>
                <Text style={[styles.tableCell, styles.colInstructions]}>
                  {item.instructions || "-"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.table}>
            <Text style={styles.emptyState}>No medications listed in this prescription.</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Doctor's Signature</Text>
          </View>
        </View>

        <View style={styles.disclaimer} fixed>
          <Text>
            This is a computer-generated prescription issued by University Health System. Generated on{" "}
            {formatDate(new Date())}.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrescriptionPDF;
