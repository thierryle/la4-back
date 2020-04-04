/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * Classe représentant un backup de commentaire.
 */
@Data
public class BackupCommentDTO implements Serializable {
	private static final long serialVersionUID = -9158594159503079245L;

	private String authorName;
	private Date date;
	private String content;
	private String nominationCategoryName;
	private String nominationReason;
}
