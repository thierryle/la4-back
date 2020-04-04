package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserAndRecordDTO implements Serializable {
	private static final long serialVersionUID = 2889080701358606882L;

	private Long userId;
	private Integer record;
	
	public UserAndRecordDTO(final Long userId, final Integer record) {
		this.userId = userId;
		this.record = record;
	}
}
