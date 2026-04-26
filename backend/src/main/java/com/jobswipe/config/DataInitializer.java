package com.jobswipe.config;

import com.jobswipe.entity.Application;
import com.jobswipe.entity.ApplicationStatus;
import com.jobswipe.entity.CompanyProfile;
import com.jobswipe.entity.ExperienceLevel;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.JobType;
import com.jobswipe.entity.Swipe;
import com.jobswipe.entity.SwipeAction;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.entity.WorkMode;
import com.jobswipe.repository.ApplicationRepository;
import com.jobswipe.repository.CompanyProfileRepository;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.JobSeekerProfileRepository;
import com.jobswipe.repository.SwipeRepository;
import com.jobswipe.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
  private final UserRepository userRepository;
  private final JobSeekerProfileRepository jobSeekerProfileRepository;
  private final CompanyProfileRepository companyProfileRepository;
  private final JobRepository jobRepository;
  private final SwipeRepository swipeRepository;
  private final ApplicationRepository applicationRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(
      UserRepository userRepository,
      JobSeekerProfileRepository jobSeekerProfileRepository,
      CompanyProfileRepository companyProfileRepository,
      JobRepository jobRepository,
      SwipeRepository swipeRepository,
      ApplicationRepository applicationRepository,
      PasswordEncoder passwordEncoder
  ) {
    this.userRepository = userRepository;
    this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    this.companyProfileRepository = companyProfileRepository;
    this.jobRepository = jobRepository;
    this.swipeRepository = swipeRepository;
    this.applicationRepository = applicationRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (userRepository.count() > 0) {
      return;
    }

    User jobSeeker = user("Aarav Sharma", "jobseeker@jobswipe.dev", "JobSeeker@123", UserRole.JOB_SEEKER);
    userRepository.save(jobSeeker);

    JobSeekerProfile profile = new JobSeekerProfile();
    profile.setUser(jobSeeker);
    profile.setPhone("+91 98765 43210");
    profile.setGithubUrl("https://github.com/aarav-sharma");
    profile.setEducation("B.Tech Computer Science, 2026");
    profile.setDegree("B.Tech Computer Science");
    profile.setCollege("Bengaluru Institute of Technology");
    profile.setPassingYear(2026);
    profile.setCgpaOrPercentage("8.4 CGPA");
    profile.setSkills("Java, React, SQL, Python");
    profile.setExperienceLevel(ExperienceLevel.FRESHER);
    profile.setPreferredLocation("Bengaluru, Pune, Remote");
    profile.setPreferredJobType(JobType.INTERNSHIP);
    jobSeekerProfileRepository.save(profile);

    User recruiterOne = user("Meera Iyer", "recruiter@jobswipe.dev", "Recruiter@123", UserRole.RECRUITER);
    User recruiterTwo = user("Rohan Kapoor", "talent@cloudmint.dev", "Recruiter@123", UserRole.RECRUITER);
    User admin = user("Admin User", "admin@jobswipe.dev", "Admin@123", UserRole.ADMIN);
    userRepository.saveAll(List.of(recruiterOne, recruiterTwo, admin));

    companyProfileRepository.save(company(recruiterOne, "NovaHire Labs", "https://dummyimage.com/128x128/11131a/ffffff&text=NL", "https://novahire.example.com", "A job seeker-first hiring studio working with fast-growing product teams.", "Bengaluru"));
    companyProfileRepository.save(company(recruiterTwo, "CloudMint Systems", "https://dummyimage.com/128x128/0f766e/ffffff&text=CM", "https://cloudmint.example.com", "Cloud and data engineering consultancy hiring early-career builders.", "Hyderabad"));

    List<Job> jobs = List.of(
        job(recruiterOne, "Frontend Developer Intern", "NovaHire Labs", "https://dummyimage.com/128x128/11131a/ffffff&text=NL", "Bengaluru", JobType.INTERNSHIP, WorkMode.HYBRID, "Rs. 25,000/month", "React, TypeScript, Tailwind CSS", ExperienceLevel.FRESHER, "Build polished UI flows for a campus hiring analytics product.", "Final year candidates with React project experience.", 21),
        job(recruiterOne, "Java Backend Trainee", "NovaHire Labs", "https://dummyimage.com/128x128/11131a/ffffff&text=NL", "Pune", JobType.FULL_TIME, WorkMode.ON_SITE, "Rs. 6 LPA", "Java, Spring Boot, SQL", ExperienceLevel.FRESHER, "Work on REST APIs, authentication, and reporting services.", "Freshers with Java fundamentals and database knowledge.", 30),
        job(recruiterTwo, "Data Science Intern", "CloudMint Systems", "https://dummyimage.com/128x128/0f766e/ffffff&text=CM", "Remote", JobType.REMOTE, WorkMode.REMOTE, "Rs. 30,000/month", "Python, Pandas, Machine Learning", ExperienceLevel.FRESHER, "Create models and dashboards for customer support prediction.", "Freshers with Python notebooks or ML mini projects.", 18),
        job(recruiterTwo, "Cloud Support Associate", "CloudMint Systems", "https://dummyimage.com/128x128/0f766e/ffffff&text=CM", "Hyderabad", JobType.HYBRID, WorkMode.HYBRID, "Rs. 5.5 LPA", "AWS, Linux, Networking", ExperienceLevel.ZERO_TO_ONE, "Troubleshoot cloud deployments and document runbooks.", "Freshers familiar with Linux commands and cloud basics.", 24),
        job(recruiterOne, "Salesforce Developer Intern", "BrightPath CRM", "https://dummyimage.com/128x128/7c3aed/ffffff&text=BP", "Chennai", JobType.INTERNSHIP, WorkMode.ON_SITE, "Rs. 22,000/month", "Salesforce, Apex, SOQL", ExperienceLevel.FRESHER, "Customize CRM workflows and build small Apex components.", "Job seekers interested in CRM platforms and low-code automation.", 25),
        job(recruiterOne, "QA Testing Intern", "PixelProof QA", "https://dummyimage.com/128x128/f97316/ffffff&text=QA", "Noida", JobType.INTERNSHIP, WorkMode.ON_SITE, "Rs. 18,000/month", "Manual Testing, Selenium, Jira", ExperienceLevel.FRESHER, "Write test cases, execute regression suites, and log defects.", "Freshers with testing basics and attention to detail.", 28),
        job(recruiterTwo, "SQL Analyst Trainee", "LedgerLoop", "https://dummyimage.com/128x128/11131a/ffffff&text=LL", "Mumbai", JobType.FULL_TIME, WorkMode.ON_SITE, "Rs. 4.8 LPA", "SQL, Excel, Power BI", ExperienceLevel.FRESHER, "Analyze operations data and prepare weekly business reports.", "Candidates comfortable with joins, grouping, and dashboards.", 20),
        job(recruiterTwo, "UI/UX Design Intern", "CraftLayer Studio", "https://dummyimage.com/128x128/0f766e/ffffff&text=UX", "Remote", JobType.REMOTE, WorkMode.REMOTE, "Rs. 20,000/month", "Figma, UX Research, Prototyping", ExperienceLevel.FRESHER, "Design mobile-first screens and usability flows for SaaS tools.", "Portfolio with at least two UI/UX case studies.", 19),
        job(recruiterOne, "Python Automation Intern", "FlowOps", "https://dummyimage.com/128x128/11131a/ffffff&text=FO", "Kochi", JobType.INTERNSHIP, WorkMode.HYBRID, "Rs. 24,000/month", "Python, APIs, Scripting", ExperienceLevel.FRESHER, "Automate internal tasks and connect operations data sources.", "Candidates who have built Python scripts or API integrations.", 23),
        job(recruiterTwo, "MERN Stack Fresher", "StackNest", "https://dummyimage.com/128x128/7c3aed/ffffff&text=SN", "Ahmedabad", JobType.FULL_TIME, WorkMode.ON_SITE, "Rs. 5 LPA", "MongoDB, Express, React, Node.js", ExperienceLevel.FRESHER, "Build full-stack modules for an education marketplace.", "Freshers with a deployed full-stack project.", 31),
        job(recruiterOne, "DevOps Intern", "ShipQuick", "https://dummyimage.com/128x128/f97316/ffffff&text=SQ", "Bengaluru", JobType.HYBRID, WorkMode.HYBRID, "Rs. 28,000/month", "Docker, GitHub Actions, AWS", ExperienceLevel.ZERO_TO_ONE, "Assist with CI pipelines, container images, and deployment checks.", "Freshers familiar with Git and basic Linux.", 27),
        job(recruiterTwo, "Cybersecurity Analyst Intern", "SecureLeaf", "https://dummyimage.com/128x128/11131a/ffffff&text=SL", "Gurugram", JobType.INTERNSHIP, WorkMode.ON_SITE, "Rs. 26,000/month", "Security Testing, OWASP, Linux", ExperienceLevel.FRESHER, "Support vulnerability checks and write security observation notes.", "Candidates with cybersecurity coursework or CTF participation.", 26),
        job(recruiterOne, "Mobile App Developer Intern", "PocketWorks", "https://dummyimage.com/128x128/0f766e/ffffff&text=PW", "Remote", JobType.REMOTE, WorkMode.REMOTE, "Rs. 23,000/month", "React Native, JavaScript, Firebase", ExperienceLevel.FRESHER, "Create mobile screens and integrate Firebase-backed features.", "Candidates with Android or React Native demo apps.", 32),
        job(recruiterTwo, "Business Analyst Fresher", "InsightBridge", "https://dummyimage.com/128x128/7c3aed/ffffff&text=IB", "Delhi", JobType.FULL_TIME, WorkMode.ON_SITE, "Rs. 4.5 LPA", "SQL, Documentation, Agile", ExperienceLevel.FRESHER, "Convert stakeholder needs into user stories and data views.", "Freshers with strong communication and analytical thinking.", 17),
        job(recruiterOne, "AI Prompt Engineering Intern", "CleverText AI", "https://dummyimage.com/128x128/f97316/ffffff&text=AI", "Pune", JobType.HYBRID, WorkMode.HYBRID, "Rs. 32,000/month", "Prompt Engineering, Python, Evaluation", ExperienceLevel.FRESHER, "Design prompts, evaluate model output, and build small test sets.", "Candidates with strong writing and basic programming knowledge.", 22)
    );
    jobRepository.saveAll(jobs);

    Application application = new Application();
    application.setJobSeeker(jobSeeker);
    application.setJob(jobs.get(2));
    application.setGithubUrl(profile.getGithubUrl());
    application.setResumePdfUrl(profile.getResumePdfUrl());
    application.setStatus(ApplicationStatus.SHORTLISTED);
    applicationRepository.save(application);

    Swipe swipe = new Swipe();
    swipe.setJobSeeker(jobSeeker);
    swipe.setJob(jobs.get(2));
    swipe.setAction(SwipeAction.LIKE);
    swipeRepository.save(swipe);
  }

  private User user(String name, String email, String password, UserRole role) {
    User user = new User();
    user.setName(name);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(password));
    user.setRole(role);
    user.setAcceptedTerms(true);
    user.setAcceptedTermsAt(Instant.now());
    return user;
  }

  private CompanyProfile company(User recruiter, String name, String logo, String website, String description, String location) {
    CompanyProfile profile = new CompanyProfile();
    profile.setRecruiter(recruiter);
    profile.setCompanyName(name);
    profile.setCompanyLogoUrl(logo);
    profile.setWebsite(website);
    profile.setDescription(description);
    profile.setLocation(location);
    return profile;
  }

  private Job job(User recruiter, String title, String companyName, String logo, String location, JobType type, WorkMode workMode, String salary, String skills, ExperienceLevel experience, String description, String eligibility, int days) {
    Job job = new Job();
    job.setRecruiter(recruiter);
    job.setTitle(title);
    job.setCompanyName(companyName);
    job.setCompanyLogoUrl(logo);
    job.setLocation(location);
    job.setJobType(type);
    job.setWorkMode(workMode);
    job.setSalary(salary);
    job.setRequiredSkills(skills);
    job.setRequiredExperienceLevel(experience);
    job.setDescription(description);
    job.setEligibility(eligibility);
    job.setDeadline(LocalDate.now().plusDays(days));
    job.setActive(true);
    return job;
  }
}
