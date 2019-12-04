/**
 * 
 */
package fr.loseawards.decision.dto;

import java.io.Serializable;
import java.util.List;

/**
 * Classe représentant une liste de decisions.
 */
public class DecisionBundleDTO implements Serializable {
	private static final long serialVersionUID = -3948965764112164694L;
	
	private List<DecisionDTO> decisions;

	public List<DecisionDTO> getDecisions() {
		return decisions;
	}

	public void setDecisions(List<DecisionDTO> decisions) {
		this.decisions = decisions;
	}
}
