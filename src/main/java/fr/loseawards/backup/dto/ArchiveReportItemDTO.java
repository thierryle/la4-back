/**
 * 
 */
package fr.loseawards.backup.dto;

import fr.loseawards.archivereport.dto.ArchiveReportDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ArchiveReportItemDTO implements Serializable {
	private static final long serialVersionUID = 7733961498854494953L;
	private List<ArchiveReportDTO> items;
}
