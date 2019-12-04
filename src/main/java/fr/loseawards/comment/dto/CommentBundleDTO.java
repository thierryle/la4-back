/**
 * 
 */
package fr.loseawards.comment.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Classe contenant les données nécessaires à l'écran des images.
 */
public class CommentBundleDTO implements Serializable {
	private static final long serialVersionUID = -215495379664017010L;
	
	private Map<Long, List<CommentDTO>> comments;

	public Map<Long, List<CommentDTO>> getComments() {
		return comments;
	}

	public void setComments(Map<Long, List<CommentDTO>> comments) {
		this.comments = comments;
	}
}
