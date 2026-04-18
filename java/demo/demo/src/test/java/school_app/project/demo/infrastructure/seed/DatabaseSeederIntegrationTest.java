package school_app.project.demo.infrastructure.seed;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import school_app.project.demo.application.services.GradeService;
import school_app.project.demo.domain.entities.Subject;
import school_app.project.demo.domain.entities.Student;
import school_app.project.demo.infrastructure.repositories.GradeRepository;
import school_app.project.demo.infrastructure.repositories.SubjectRepository;
import school_app.project.demo.infrastructure.repositories.StudentRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class DatabaseSeederIntegrationTest {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private GradeService gradeService;

    @Test
    void shouldSeedGradesAndAllowSemesterAverageCalculation() {
        assertThat(studentRepository.count()).isEqualTo(5);
        assertThat(subjectRepository.count()).isEqualTo(5);
        assertThat(gradeRepository.count()).isEqualTo(20);

        Student ana = studentRepository.findByCpf("987.654.321-00").orElseThrow();
        Subject math = subjectRepository.findAll().stream()
                .filter(subject -> "Mathematics".equals(subject.getName()))
                .findFirst()
                .orElseThrow();

        Double mathAverageS1 = gradeService.calculateSubjectAverage(ana.getId(), math.getId(), 1);
        Double mathAverageS2 = gradeService.calculateSubjectAverage(ana.getId(), math.getId(), 2);
        Double mathFinalAverage = gradeService.calculateSubjectFinalAverage(ana.getId(), math.getId());

        assertThat(mathAverageS1).isEqualTo(8.5);
        assertThat(mathAverageS2).isEqualTo(8.25);
        assertThat(mathFinalAverage).isEqualTo(8.375);

        // Validate no orphan grade rows
        assertThat(gradeRepository.findAll()).allSatisfy(grade -> {
            assertThat(grade.getStudent()).isNotNull();
            assertThat(grade.getSubject()).isNotNull();
            assertThat(grade.getSemester()).isIn(1, 2);
        });
    }
}
