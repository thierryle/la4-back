/**
 * 
 */
package fr.loseawards.backup.dto;

import fr.loseawards.archiveuser.dto.ArchiveUserDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ArchiveUserItemDTO implements Serializable {
	private static final long serialVersionUID = -5608420546299250600L;
	private List<ArchiveUserDTO> items;
}
