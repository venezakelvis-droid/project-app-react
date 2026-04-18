package school_app.project.demo.application.mappers;

import school_app.project.demo.application.dtos.SchoolClassDTO;
import school_app.project.demo.domain.entities.SchoolClass;

public class SchoolClassMapper {

    public static SchoolClassDTO toDTO(SchoolClass schoolClass) {
        return SchoolClassDTO.builder()
                .id(schoolClass.getId())
                .name(schoolClass.getName())
                .schoolYear(schoolClass.getSchoolYear())
                .semester(schoolClass.getSemester())
                .room(schoolClass.getRoom())
                .shift(schoolClass.getShift())
                .build();
    }

    public static SchoolClass toEntity(SchoolClassDTO dto) {
        return SchoolClass.builder()
                .id(dto.getId())
                .name(dto.getName())
                .schoolYear(dto.getSchoolYear())
                .semester(dto.getSemester())
                .room(dto.getRoom())
                .shift(dto.getShift())
                .build();
    }
}
