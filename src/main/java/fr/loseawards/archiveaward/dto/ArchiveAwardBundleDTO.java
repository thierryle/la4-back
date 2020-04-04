package fr.loseawards.archiveaward.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
public class ArchiveAwardBundleDTO implements Serializable {
	private static final long serialVersionUID = 5495573704395203049L;
	private List<ArchiveAwardDTO> archiveAwards;

	public ArchiveAwardBundleDTO() {
	}

	public ArchiveAwardBundleDTO(List<ArchiveAwardDTO> archiveAwards) {
		this.archiveAwards = archiveAwards;
	}
}
