require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { Patient } = require("../models/Patient");
const { Doctor } = require("../models/Doctor");
const { MedicalRecord } = require("../models/MedicalRecord");
const { Prescription } = require("../models/Prescription");

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://prms:prms1234@cluster0.8kuookx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/prms";

const sampleData = {
  patients: [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      nic: "123456789V",
      patientType: "student",
      allergies: ["Penicillin", "Shellfish"],
      contact: "0771234567",
      address: "123 University Avenue, Colombo 03",
      dob: new Date("1995-03-15"),
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      nic: "987654321V",
      patientType: "public",
      allergies: ["Latex"],
      contact: "0712345678",
      address: "456 Main Street, Kandy",
      dob: new Date("1988-07-22"),
    },
    {
      name: "Michael Brown",
      email: "michael.brown@email.com",
      nic: "456789123V",
      patientType: "staff",
      allergies: [],
      contact: "0723456789",
      address: "789 Faculty Road, Colombo 07",
      dob: new Date("1990-11-08"),
    },
    {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      nic: "789123456V",
      patientType: "student",
      allergies: ["Peanuts"],
      contact: "0734567890",
      address: "321 Campus Drive, Colombo 05",
      dob: new Date("1997-01-30"),
    },
    {
      name: "David Wilson",
      email: "david.wilson@email.com",
      nic: "321654987V",
      patientType: "public",
      allergies: ["Aspirin"],
      contact: "0745678901",
      address: "654 Health Street, Galle",
      dob: new Date("1985-09-12"),
    },
    {
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      nic: "654987321V",
      patientType: "staff",
      allergies: ["Dust mites"],
      contact: "0756789012",
      address: "987 Staff Quarters, Colombo 06",
      dob: new Date("1992-05-18"),
    },
    {
      name: "Robert Taylor",
      email: "robert.taylor@email.com",
      nic: "147258369V",
      patientType: "student",
      allergies: [],
      contact: "0767890123",
      address: "147 Student Hall, Colombo 03",
      dob: new Date("1996-12-03"),
    },
    {
      name: "Jennifer Martinez",
      email: "jennifer.martinez@email.com",
      nic: "258369147V",
      patientType: "public",
      allergies: ["Sulfa drugs"],
      contact: "0778901234",
      address: "258 Community Road, Negombo",
      dob: new Date("1987-08-25"),
    },
  ],
  doctors: [
    {
      name: "Dr. Amanda Roberts",
      email: "amanda.roberts@hospital.com",
      specialization: "General Medicine",
      licenseNumber: "MD001234",
      yearsOfExperience: 8,
      contact: "0112345678",
    },
    {
      name: "Dr. James Thompson",
      email: "james.thompson@hospital.com",
      specialization: "Cardiology",
      licenseNumber: "MD002345",
      yearsOfExperience: 12,
      contact: "0113456789",
    },
    {
      name: "Dr. Maria Garcia",
      email: "maria.garcia@hospital.com",
      specialization: "Pediatrics",
      licenseNumber: "MD003456",
      yearsOfExperience: 6,
      contact: "0114567890",
    },
    {
      name: "Dr. Robert Lee",
      email: "robert.lee@hospital.com",
      specialization: "Orthopedics",
      licenseNumber: "MD004567",
      yearsOfExperience: 15,
      contact: "0115678901",
    },
    {
      name: "Dr. Sarah Chen",
      email: "sarah.chen@hospital.com",
      specialization: "Dermatology",
      licenseNumber: "MD005678",
      yearsOfExperience: 10,
      contact: "0116789012",
    },
  ],
};

const createSampleData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing sample data...");
    await User.deleteMany({ email: { $regex: /@email\.com|@hospital\.com/ } });
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await MedicalRecord.deleteMany({});
    await Prescription.deleteMany({});

    // Create patients
    console.log("Creating patients...");
    const createdPatients = [];
    const createdPatientUsers = [];

    for (const patientData of sampleData.patients) {
      // Create user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await User.create({
        name: patientData.name,
        email: patientData.email,
        password: hashedPassword,
        role: "patient",
      });

      // Create patient
      const patient = await Patient.create({
        nic: patientData.nic,
        user: user._id,
        patientType: patientData.patientType,
        allergies: patientData.allergies,
        contact: patientData.contact,
        address: patientData.address,
        dob: patientData.dob,
      });

      createdPatients.push(patient);
      createdPatientUsers.push(user);
    }

    // Create doctors
    console.log("Creating doctors...");
    const createdDoctors = [];
    const createdDoctorUsers = [];

    for (const doctorData of sampleData.doctors) {
      // Create user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = await User.create({
        name: doctorData.name,
        email: doctorData.email,
        password: hashedPassword,
        role: "doctor",
      });

      // Create doctor
      const doctor = await Doctor.create({
        user: user._id,
        specialization: doctorData.specialization,
        licenseNumber: doctorData.licenseNumber,
        yearsOfExperience: doctorData.yearsOfExperience,
        contact: doctorData.contact,
        isAvailable: true,
      });

      createdDoctors.push(doctor);
      createdDoctorUsers.push(user);
    }

    // Create medical records and prescriptions
    console.log("Creating medical records and prescriptions...");
    const medicalRecords = [
      {
        patientIndex: 0,
        doctorIndex: 0,
        soap: {
          subjective:
            "Patient complains of fever, headache, and body aches for the past 3 days. No recent travel history.",
          objective:
            "Temperature: 38.5°C, Blood pressure: 120/80, Pulse: 95 bpm, Respiration: 18/min. Patient appears tired but alert.",
          assessment:
            "Viral fever with mild dehydration. No signs of serious complications.",
          plan: "Rest, increased fluid intake, symptomatic treatment with antipyretics. Follow up in 3 days if symptoms persist.",
        },
        vitals: {
          temperature: 38.5,
          bloodPressure: "120/80",
          pulse: 95,
          respiration: 18,
        },
        notes: "Patient advised to rest and maintain hydration.",
        prescriptions: [
          {
            drug: "Paracetamol",
            dosage: "500mg",
            instructions: "Take every 6 hours as needed for fever",
            duration: "3 days",
          },
          {
            drug: "Ibuprofen",
            dosage: "400mg",
            instructions: "Take with food if needed for pain",
            duration: "3 days",
          },
        ],
      },
      {
        patientIndex: 1,
        doctorIndex: 1,
        soap: {
          subjective:
            "Chest pain and shortness of breath during physical activity. Pain is sharp and radiates to left arm.",
          objective:
            "Blood pressure: 140/90, Pulse: 110 bpm, Heart rate regular. No signs of acute distress.",
          assessment: "Possible angina. Need further cardiac evaluation.",
          plan: "ECG and stress test recommended. Lifestyle modifications advised.",
        },
        vitals: {
          temperature: 36.8,
          bloodPressure: "140/90",
          pulse: 110,
          respiration: 20,
        },
        notes: "Patient referred for cardiac evaluation.",
        prescriptions: [
          {
            drug: "Aspirin",
            dosage: "75mg",
            instructions: "Take once daily with food",
            duration: "30 days",
          },
        ],
      },
      {
        patientIndex: 2,
        doctorIndex: 2,
        soap: {
          subjective:
            "Child presents with high fever, cough, and difficulty breathing. Parents report symptoms for 2 days.",
          objective:
            "Temperature: 39.2°C, Respiratory rate: 25/min, Heart rate: 120 bpm. Child appears lethargic.",
          assessment: "Suspected pneumonia. Requires immediate treatment.",
          plan: "Antibiotic therapy, fever management, and close monitoring.",
        },
        vitals: {
          temperature: 39.2,
          bloodPressure: "90/60",
          pulse: 120,
          respiration: 25,
        },
        notes: "Child requires close monitoring for respiratory distress.",
        prescriptions: [
          {
            drug: "Amoxicillin",
            dosage: "250mg",
            instructions: "Take three times daily with food",
            duration: "7 days",
          },
          {
            drug: "Paracetamol",
            dosage: "250mg",
            instructions: "Take every 6 hours for fever",
            duration: "5 days",
          },
        ],
      },
      {
        patientIndex: 3,
        doctorIndex: 3,
        soap: {
          subjective:
            "Patient reports knee pain after sports injury. Pain is worse with movement and weight bearing.",
          objective:
            "Knee shows mild swelling, limited range of motion. No deformity or instability.",
          assessment: "Knee sprain with possible ligament involvement.",
          plan: "RICE protocol, pain management, and physiotherapy referral.",
        },
        vitals: {
          temperature: 36.5,
          bloodPressure: "110/70",
          pulse: 75,
          respiration: 16,
        },
        notes: "Patient advised to avoid weight bearing activities.",
        prescriptions: [
          {
            drug: "Ibuprofen",
            dosage: "600mg",
            instructions: "Take three times daily with food",
            duration: "7 days",
          },
        ],
      },
      {
        patientIndex: 4,
        doctorIndex: 4,
        soap: {
          subjective:
            "Patient presents with itchy, red rash on arms and legs. Rash has been present for 1 week.",
          objective:
            "Erythematous, papular rash on bilateral arms and legs. No signs of infection.",
          assessment: "Contact dermatitis, likely allergic reaction.",
          plan: "Topical treatment and allergen avoidance.",
        },
        vitals: {
          temperature: 36.7,
          bloodPressure: "125/80",
          pulse: 80,
          respiration: 18,
        },
        notes: "Patient advised to avoid potential allergens.",
        prescriptions: [
          {
            drug: "Hydrocortisone cream",
            dosage: "1%",
            instructions: "Apply to affected areas twice daily",
            duration: "10 days",
          },
          {
            drug: "Cetirizine",
            dosage: "10mg",
            instructions: "Take once daily at bedtime",
            duration: "14 days",
          },
        ],
      },
    ];

    for (const recordData of medicalRecords) {
      // Create medical record
      const medicalRecord = await MedicalRecord.create({
        patient: createdPatients[recordData.patientIndex]._id,
        doctor: createdDoctors[recordData.doctorIndex]._id,
        soap: recordData.soap,
        vitals: recordData.vitals,
        notes: recordData.notes,
      });

      // Create prescriptions
      if (recordData.prescriptions && recordData.prescriptions.length > 0) {
        const prescription = await Prescription.create({
          doctor: createdDoctors[recordData.doctorIndex]._id,
          patient: createdPatients[recordData.patientIndex]._id,
          medicalRecord: medicalRecord._id,
          items: recordData.prescriptions,
        });

        // Link prescription to medical record
        medicalRecord.prescriptions = [prescription._id];
        await medicalRecord.save();
      }
    }

    console.log("\n✅ Sample data created successfully!");
    console.log(`📊 Created ${createdPatients.length} patients`);
    console.log(`👨‍⚕️ Created ${createdDoctors.length} doctors`);
    console.log(`📋 Created ${medicalRecords.length} medical records`);
    console.log(`💊 Created prescriptions for medical records`);

    console.log("\n🔑 Login Credentials:");
    console.log("Admin: selvakumarthushanthan5@gmail.com / admin@123$");
    console.log("Patients: [email] / password123");
    console.log("Doctors: [email] / password123");

    console.log("\n📧 Sample Patient Emails:");
    sampleData.patients.forEach((patient) => {
      console.log(`- ${patient.email}`);
    });

    console.log("\n👨‍⚕️ Sample Doctor Emails:");
    sampleData.doctors.forEach((doctor) => {
      console.log(`- ${doctor.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating sample data:", error.message);
    process.exit(1);
  }
};

createSampleData();
