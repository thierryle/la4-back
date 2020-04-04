/**
 * 
 */
package fr.loseawards.backup.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class BackupCommentItemDTO implements Serializable {
	List<BackupCommentDTO> items;
}
