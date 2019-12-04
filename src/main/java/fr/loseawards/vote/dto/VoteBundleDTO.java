/**
 * 
 */
package fr.loseawards.vote.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * Classe représentant une liste de votes.
 */
@Data
public class VoteBundleDTO implements Serializable {
	private static final long serialVersionUID = -3948965764112164694L;
	
	private List<VoteDTO> votes;
}
