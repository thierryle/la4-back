package fr.loseawards.decision.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * Classe représentant la décision du président dans une égalité pour une catégorie.
 */
@Data
public class DecisionDTO implements Serializable {
	private static final long serialVersionUID = -3617406664238569122L;
	
	protected Long id;
	protected Long categoryId;
	protected Long nominatedId;
	
	public DecisionDTO() {
	}
	
	public DecisionDTO(Long id, Long categoryId, Long nominatedId) {
		this.id = id;
		this.categoryId = categoryId;
		this.nominatedId = nominatedId;
	}
}