import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const password = async (value: string) => bcrypt.hash(value, 10);

async function main() {
  await prisma.application.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.job.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.user.deleteMany();

  const [studentPassword, recruiterPassword, adminPassword] = await Promise.all([
    password("Student@123"),
    password("Recruiter@123"),
    password("Admin@123")
  ]);

  const student = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "student@jobswipe.dev",
      passwordHash: studentPassword,
      role: "STUDENT",
      studentProfile: {
        create: {
          phone: "+91 98765 43210",
          skills: "Java, React, SQL, Python",
          education: "B.Tech Computer Science, 2026",
          resumeUrl: "https://example.com/aarav-resume.pdf",
          preferredLocation: "Bengaluru, Pune, Remote",
          preferredJobType: "Internship, Full-time",
          experienceLevel: "Fresher"
        }
      }
    }
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Meera Iyer",
      email: "recruiter@jobswipe.dev",
      passwordHash: recruiterPassword,
      role: "RECRUITER",
      companyProfile: {
        create: {
          companyName: "NovaHire Labs",
          website: "https://novahire.example.com",
          description: "A student-first hiring studio working with fast-growing product teams.",
          location: "Bengaluru"
        }
      }
    }
  });

  const recruiterTwo = await prisma.user.create({
    data: {
      name: "Rohan Kapoor",
      email: "talent@cloudmint.dev",
      passwordHash: recruiterPassword,
      role: "RECRUITER",
      companyProfile: {
        create: {
          companyName: "CloudMint Systems",
          website: "https://cloudmint.example.com",
          description: "Cloud and data engineering consultancy hiring early-career builders.",
          location: "Hyderabad"
        }
      }
    }
  });

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@jobswipe.dev",
      passwordHash: adminPassword,
      role: "ADMIN"
    }
  });

  const future = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const jobs = [
    {
      recruiterId: recruiter.id,
      title: "Frontend Developer Intern",
      companyName: "NovaHire Labs",
      location: "Bengaluru",
      jobType: "Internship",
      salary: "Rs. 25,000/month",
      skills: "React, TypeScript, Tailwind CSS",
      description: "Build polished UI flows for a campus hiring analytics product.",
      eligibility: "Final year students with React project experience.",
      deadline: future(21)
    },
    {
      recruiterId: recruiter.id,
      title: "Java Backend Trainee",
      companyName: "NovaHire Labs",
      location: "Pune",
      jobType: "Full-time",
      salary: "Rs. 6 LPA",
      skills: "Java, Spring Boot, SQL",
      description: "Work on REST APIs, authentication, and reporting services.",
      eligibility: "Freshers with Java fundamentals and database knowledge.",
      deadline: future(30)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "Data Science Intern",
      companyName: "CloudMint Systems",
      location: "Remote",
      jobType: "Remote",
      salary: "Rs. 30,000/month",
      skills: "Python, Pandas, Machine Learning",
      description: "Create models and dashboards for customer support prediction.",
      eligibility: "Students with Python notebooks or ML mini projects.",
      deadline: future(18)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "Cloud Support Associate",
      companyName: "CloudMint Systems",
      location: "Hyderabad",
      jobType: "Hybrid",
      salary: "Rs. 5.5 LPA",
      skills: "AWS, Linux, Networking",
      description: "Troubleshoot cloud deployments and document runbooks.",
      eligibility: "Freshers familiar with Linux commands and cloud basics.",
      deadline: future(24)
    },
    {
      recruiterId: recruiter.id,
      title: "Salesforce Developer Intern",
      companyName: "BrightPath CRM",
      location: "Chennai",
      jobType: "Internship",
      salary: "Rs. 22,000/month",
      skills: "Salesforce, Apex, SOQL",
      description: "Customize CRM workflows and build small Apex components.",
      eligibility: "Students interested in CRM platforms and low-code automation.",
      deadline: future(25)
    },
    {
      recruiterId: recruiter.id,
      title: "QA Testing Intern",
      companyName: "PixelProof QA",
      location: "Noida",
      jobType: "Internship",
      salary: "Rs. 18,000/month",
      skills: "Manual Testing, Selenium, Jira",
      description: "Write test cases, execute regression suites, and log defects.",
      eligibility: "Freshers with testing basics and attention to detail.",
      deadline: future(28)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "SQL Analyst Trainee",
      companyName: "LedgerLoop",
      location: "Mumbai",
      jobType: "Full-time",
      salary: "Rs. 4.8 LPA",
      skills: "SQL, Excel, Power BI",
      description: "Analyze operations data and prepare weekly business reports.",
      eligibility: "Students comfortable with joins, grouping, and dashboards.",
      deadline: future(20)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "UI/UX Design Intern",
      companyName: "CraftLayer Studio",
      location: "Remote",
      jobType: "Remote",
      salary: "Rs. 20,000/month",
      skills: "Figma, UX Research, Prototyping",
      description: "Design mobile-first screens and usability flows for SaaS tools.",
      eligibility: "Portfolio with at least two UI/UX case studies.",
      deadline: future(19)
    },
    {
      recruiterId: recruiter.id,
      title: "Python Automation Intern",
      companyName: "FlowOps",
      location: "Kochi",
      jobType: "Internship",
      salary: "Rs. 24,000/month",
      skills: "Python, APIs, Scripting",
      description: "Automate internal tasks and connect operations data sources.",
      eligibility: "Students who have built Python scripts or API integrations.",
      deadline: future(23)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "MERN Stack Fresher",
      companyName: "StackNest",
      location: "Ahmedabad",
      jobType: "Full-time",
      salary: "Rs. 5 LPA",
      skills: "MongoDB, Express, React, Node.js",
      description: "Build full-stack modules for an education marketplace.",
      eligibility: "Freshers with a deployed full-stack project.",
      deadline: future(31)
    },
    {
      recruiterId: recruiter.id,
      title: "DevOps Intern",
      companyName: "ShipQuick",
      location: "Bengaluru",
      jobType: "Hybrid",
      salary: "Rs. 28,000/month",
      skills: "Docker, GitHub Actions, AWS",
      description: "Assist with CI pipelines, container images, and deployment checks.",
      eligibility: "Students familiar with Git and basic Linux.",
      deadline: future(27)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "Cybersecurity Analyst Intern",
      companyName: "SecureLeaf",
      location: "Gurugram",
      jobType: "Internship",
      salary: "Rs. 26,000/month",
      skills: "Security Testing, OWASP, Linux",
      description: "Support vulnerability checks and write security observation notes.",
      eligibility: "Students with cybersecurity coursework or CTF participation.",
      deadline: future(26)
    },
    {
      recruiterId: recruiter.id,
      title: "Mobile App Developer Intern",
      companyName: "PocketWorks",
      location: "Remote",
      jobType: "Remote",
      salary: "Rs. 23,000/month",
      skills: "React Native, JavaScript, Firebase",
      description: "Create mobile screens and integrate Firebase-backed features.",
      eligibility: "Students with Android or React Native demo apps.",
      deadline: future(32)
    },
    {
      recruiterId: recruiterTwo.id,
      title: "Business Analyst Fresher",
      companyName: "InsightBridge",
      location: "Delhi",
      jobType: "Full-time",
      salary: "Rs. 4.5 LPA",
      skills: "SQL, Documentation, Agile",
      description: "Convert stakeholder needs into user stories and data views.",
      eligibility: "Freshers with strong communication and analytical thinking.",
      deadline: future(17)
    },
    {
      recruiterId: recruiter.id,
      title: "AI Prompt Engineering Intern",
      companyName: "CleverText AI",
      location: "Pune",
      jobType: "Hybrid",
      salary: "Rs. 32,000/month",
      skills: "Prompt Engineering, Python, Evaluation",
      description: "Design prompts, evaluate model output, and build small test sets.",
      eligibility: "Students with strong writing and basic programming knowledge.",
      deadline: future(22)
    }
  ];

  const createdJobs = await prisma.job.createMany({ data: jobs });

  const firstJob = await prisma.job.findFirstOrThrow({
    where: { title: "Frontend Developer Intern" }
  });
  const secondJob = await prisma.job.findFirstOrThrow({
    where: { title: "Data Science Intern" }
  });

  await prisma.swipe.create({
    data: {
      userId: student.id,
      jobId: firstJob.id,
      action: "SAVE"
    }
  });

  await prisma.application.create({
    data: {
      userId: student.id,
      jobId: secondJob.id,
      status: "SHORTLISTED"
    }
  });

  await prisma.swipe.create({
    data: {
      userId: student.id,
      jobId: secondJob.id,
      action: "LIKE"
    }
  });

  console.log(`Seeded JobSwipe with ${createdJobs.count} jobs and demo accounts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
