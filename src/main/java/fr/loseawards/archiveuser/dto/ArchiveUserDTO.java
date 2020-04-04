package fr.loseawards.archiveuser.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ArchiveUserDTO implements Serializable {
	private Long id;
	private String firstName;
	private String lastName;
	private Integer firstYear;
	private Integer lastYear;
	
	public ArchiveUserDTO() {
	}
	
	public ArchiveUserDTO(final Long id, final String firstName, final String lastName, final Integer firstYear, final Integer lastYear) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.firstYear = firstYear;
		this.lastYear = lastYear;
	}
}
