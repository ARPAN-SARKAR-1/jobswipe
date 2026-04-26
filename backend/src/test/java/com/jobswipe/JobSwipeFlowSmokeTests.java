package com.jobswipe;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobswipe.entity.ExperienceLevel;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.JobType;
import com.jobswipe.entity.SwipeAction;
import com.jobswipe.entity.User;
import com.jobswipe.entity.WorkMode;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.UserRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class JobSwipeFlowSmokeTests {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private JobRepository jobRepository;

  @Test
  void coreFlowsWork() throws Exception {
    String jobSeekerEmail = "flow-jobseeker@jobswipe.dev";
    String recruiterEmail = "flow-recruiter@jobswipe.dev";

    String jobSeekerToken = token(mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"name":"Flow Job Seeker","email":"flow-jobseeker@jobswipe.dev","password":"Password@123","confirmPassword":"Password@123","role":"JOB_SEEKER","acceptedTerms":true}
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.role").value("JOB_SEEKER"))
        .andReturn());

    String recruiterToken = token(mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"name":"Flow Recruiter","email":"flow-recruiter@jobswipe.dev","password":"Password@123","confirmPassword":"Password@123","role":"RECRUITER","acceptedTerms":true}
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.role").value("RECRUITER"))
        .andReturn());

    mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"" + jobSeekerEmail + "\",\"password\":\"Password@123\"}"))
        .andExpect(status().isOk());

    MvcResult forgot = mockMvc.perform(post("/api/auth/forgot-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"" + jobSeekerEmail + "\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.resetToken").exists())
        .andReturn();
    String resetToken = objectMapper.readTree(forgot.getResponse().getContentAsString()).get("resetToken").asText();
    mockMvc.perform(post("/api/auth/reset-password")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"token\":\"" + resetToken + "\",\"newPassword\":\"Password@456\",\"confirmPassword\":\"Password@456\"}"))
        .andExpect(status().isOk());

    mockMvc.perform(put("/api/jobseeker/profile")
        .header("Authorization", bearer(jobSeekerToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"phone":"9876543210","githubUrl":"https://github.com/flow-jobseeker","education":"B.Tech Computer Science","degree":"B.Tech","college":"JobSwipe Institute","passingYear":2026,"cgpaOrPercentage":"8.7 CGPA","skills":"Java, Spring Boot, React, SQL","experienceLevel":"FRESHER","preferredLocation":"Remote","preferredJobType":"FULL_TIME"}
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.githubUrl").value("https://github.com/flow-jobseeker"))
        .andExpect(jsonPath("$.degree").value("B.Tech"))
        .andExpect(jsonPath("$.experienceLevel").value("FRESHER"));

    MockMultipartFile picture = new MockMultipartFile("file", "avatar.png", "image/png", new byte[]{1, 2, 3});
    mockMvc.perform(multipart("/api/jobseeker/profile-picture").file(picture).header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.url").exists());

    MockMultipartFile resume = new MockMultipartFile("file", "resume.pdf", "application/pdf", "%PDF-1.4 demo".getBytes());
    mockMvc.perform(multipart("/api/jobseeker/resume").file(resume).header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.url").exists());

    MockMultipartFile logo = new MockMultipartFile("file", "logo.png", "image/png", new byte[]{4, 5, 6});
    mockMvc.perform(multipart("/api/recruiter/company-logo").file(logo).header("Authorization", bearer(recruiterToken)))
        .andExpect(status().isOk());

    MvcResult posted = mockMvc.perform(post("/api/jobs")
        .header("Authorization", bearer(recruiterToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"title":"Flow Java Developer","companyName":"Flow Recruiter Labs","location":"Remote","jobType":"FULL_TIME","workMode":"REMOTE","salary":"Rs. 7 LPA","requiredSkills":"Java, Spring Boot, PostgreSQL","requiredExperienceLevel":"FRESHER","description":"Build APIs for a polished swipe-based hiring demo.","eligibility":"Freshers with Java and SQL fundamentals.","deadline":"%s","active":true}
            """.formatted(LocalDate.now().plusDays(10))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Flow Java Developer"))
        .andReturn();
    String jobId = objectMapper.readTree(posted.getResponse().getContentAsString()).get("id").asText();

    User recruiter = userRepository.findByEmailIgnoreCase(recruiterEmail).orElseThrow();
    Job expired = new Job();
    expired.setRecruiter(recruiter);
    expired.setTitle("Expired Smoke Job");
    expired.setCompanyName("Flow Recruiter Labs");
    expired.setLocation("Remote");
    expired.setJobType(JobType.FULL_TIME);
    expired.setWorkMode(WorkMode.REMOTE);
    expired.setSalary("Rs. 5 LPA");
    expired.setRequiredSkills("Java");
    expired.setRequiredExperienceLevel(ExperienceLevel.FRESHER);
    expired.setDescription("This job is intentionally expired for feed filtering.");
    expired.setEligibility("Demo only.");
    expired.setDeadline(LocalDate.now().minusDays(1));
    expired.setActive(true);
    jobRepository.save(expired);

    mockMvc.perform(get("/api/jobs/feed?jobType=FULL_TIME&experienceLevel=FRESHER&location=Remote&skill=Spring&workMode=REMOTE").header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(content().string(containsString("Flow Java Developer")))
        .andExpect(content().string(not(containsString("Expired Smoke Job"))));

    mockMvc.perform(post("/api/swipes")
        .header("Authorization", bearer(jobSeekerToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"jobId\":\"" + jobId + "\",\"action\":\"SAVE\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.action").value(SwipeAction.SAVE.name()));
    mockMvc.perform(get("/api/swipes/history").header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].action").value(SwipeAction.SAVE.name()));
    mockMvc.perform(post("/api/swipes/undo").header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.action").value(SwipeAction.SAVE.name()));

    mockMvc.perform(post("/api/swipes")
        .header("Authorization", bearer(jobSeekerToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"jobId\":\"" + jobId + "\",\"action\":\"LIKE\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.action").value(SwipeAction.LIKE.name()));

    MvcResult applications = mockMvc.perform(get("/api/applications/my").header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andReturn();
    JsonNode firstApplication = objectMapper.readTree(applications.getResponse().getContentAsString()).get(0);
    mockMvc.perform(put("/api/applications/" + firstApplication.get("id").asText() + "/withdraw").header("Authorization", bearer(jobSeekerToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("WITHDRAWN"));

    String adminToken = token(mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"admin@jobswipe.dev\",\"password\":\"Admin@123\"}"))
        .andExpect(status().isOk())
        .andReturn());
    mockMvc.perform(get("/api/admin/dashboard").header("Authorization", bearer(adminToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.totalUsers").exists())
        .andExpect(jsonPath("$.swipes").exists());
  }

  private String token(MvcResult result) throws Exception {
    return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
  }

  private String bearer(String token) {
    return "Bearer " + token;
  }
}
