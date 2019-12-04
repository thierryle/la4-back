/**
 * 
 */
package fr.loseawards.vote.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Classe représentant un vote.
 */
@Data
public class VoteDTO implements Serializable {
	private static final long serialVersionUID = -6875789923547312648L;

	protected Long id;
	protected Long categoryId;
	protected Long voterId;
	protected Long nominationId;
	protected String reason;
	
	public VoteDTO() {
	}
	
	public VoteDTO(Long id, Long categoryId, Long voterId, Long nominationId, String reason) {
		this.id = id;
		this.categoryId = categoryId;
		this.voterId = voterId;
		this.nominationId = nominationId;
		this.reason = reason;
	}
}
