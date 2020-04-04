/**
 * 
 */
package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

/**
 * Classe représentant une récompense dans les archives.
 */
@Data
public class ArchiveAwardDTO implements Serializable {
	private static final long serialVersionUID = 9005018728178356827L;

	private Long id;
	private Long categoryId;
	private List<Long> usersIds;
	private Integer year;
	private String reason;
	
	public ArchiveAwardDTO() {
	}
	
	public ArchiveAwardDTO(Long id, Integer year, Long categoryId, List<Long> usersIds, String reason) {
		this.id = id;
		this.year = year;
		this.categoryId = categoryId;
		this.usersIds = usersIds;
		this.reason = reason;
	}
}
