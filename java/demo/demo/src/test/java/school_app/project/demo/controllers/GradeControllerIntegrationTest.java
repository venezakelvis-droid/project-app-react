package school_app.project.demo.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import school_app.project.demo.application.dtos.GradeDTO;
import school_app.project.demo.domain.entities.Grade;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.infrastructure.repositories.GradeRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
class GradeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Test
    void shouldCreateGrade() throws Exception {
        // Create test data
        Student student = Student.builder()
                .name("Test Student")
                .cpf("12345678901")
                .email("student@test.com")
                .enrollmentNumber("2024001")
                .build();
        student = studentRepository.save(student);

        Subject subject = Subject.builder()
                .name("Mathematics")
                .workloadHours(60)
                .description("Basic Mathematics")
                .build();
        subject = subjectRepository.save(subject);

        GradeDTO dto = GradeDTO.builder()
                .studentId(student.getId())
                .subjectId(subject.getId())
                .semester(1)
                .note1Semester1(8.0)
                .note2Semester1(8.0)
                .note3Semester1(8.0)
                .note4Semester1(8.0)
                .note1Semester2(7.0)
                .note2Semester2(7.0)
                .note3Semester2(7.0)
                .note4Semester2(7.0)
                .build();

        mockMvc.perform(post("/api/grades")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.averageSemester1").value(8.0))
                .andExpect(jsonPath("$.averageSemester2").value(7.0))
                .andExpect(jsonPath("$.finalAverage").value(7.5))
                .andExpect(jsonPath("$.status").value("APROVADO"));
    }

    @Test
    void shouldGetStudentOverallAverage() throws Exception {
        // Create test data
        Student student = Student.builder()
                .name("Test Student")
                .cpf("12345678901")
                .email("student@test.com")
                .enrollmentNumber("2024001")
                .build();
        student = studentRepository.save(student);

        Subject subject1 = Subject.builder()
                .name("Mathematics")
                .workloadHours(60)
                .description("Basic Mathematics")
                .build();
        subject1 = subjectRepository.save(subject1);

        Subject subject2 = Subject.builder()
                .name("Portuguese")
                .workloadHours(60)
                .description("Portuguese Language")
                .build();
        subject2 = subjectRepository.save(subject2);

        // Create grades
        Grade grade1 = Grade.builder()
                .student(student)
                .subject(subject1)
                .semester(1)
                .note1Semester1(8.0)
                .note2Semester1(8.0)
                .note3Semester1(8.0)
                .note4Semester1(8.0)
                .note1Semester2(8.0)
                .note2Semester2(8.0)
                .note3Semester2(8.0)
                .note4Semester2(8.0)
                .build();
        grade1.calculateAverages();
        gradeRepository.save(grade1);

        Grade grade2 = Grade.builder()
                .student(student)
                .subject(subject2)
                .semester(1)
                .note1Semester1(7.0)
                .note2Semester1(7.0)
                .note3Semester1(7.0)
                .note4Semester1(7.0)
                .note1Semester2(7.0)
                .note2Semester2(7.0)
                .note3Semester2(7.0)
                .note4Semester2(7.0)
                .build();
        grade2.calculateAverages();
        gradeRepository.save(grade2);

        mockMvc.perform(get("/api/grades/student/{studentId}/overall-average", student.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("7.5"));
    }

    @Test
    void shouldGetSubjectFinalAverage() throws Exception {
        // Create test data
        Student student = Student.builder()
                .name("Test Student")
                .cpf("12345678901")
                .email("student@test.com")
                .enrollmentNumber("2024001")
                .build();
        student = studentRepository.save(student);

        Subject subject = Subject.builder()
                .name("Mathematics")
                .workloadHours(60)
                .description("Basic Mathematics")
                .build();
        subject = subjectRepository.save(subject);

        // Create grades for both semesters
        Grade grade1 = Grade.builder()
                .student(student)
                .subject(subject)
                .semester(1)
                .note1Semester1(8.0)
                .note2Semester1(8.0)
                .note3Semester1(8.0)
                .note4Semester1(8.0)
                .note1Semester2(8.0)
                .note2Semester2(8.0)
                .note3Semester2(8.0)
                .note4Semester2(8.0)
                .build();
        grade1.calculateAverages();
        gradeRepository.save(grade1);

        Grade grade2 = Grade.builder()
                .student(student)
                .subject(subject)
                .semester(2)
                .note1Semester1(9.0)
                .note2Semester1(9.0)
                .note3Semester1(9.0)
                .note4Semester1(9.0)
                .note1Semester2(9.0)
                .note2Semester2(9.0)
                .note3Semester2(9.0)
                .note4Semester2(9.0)
                .build();
        grade2.calculateAverages();
        gradeRepository.save(grade2);

        mockMvc.perform(get("/api/grades/student/{studentId}/subject/{subjectId}/average", student.getId(), subject.getId()))
                .andExpect(status().isOk())
                .andExpect(content().string("8.5"));
    }
}