/**
 * 
 */
package fr.loseawards.archivereport.dto;

import com.google.appengine.api.datastore.Blob;
import com.googlecode.objectify.annotation.Index;
import fr.loseawards.util.Converter;
import lombok.Data;

import java.io.Serializable;

/**
 * Classe représentant un compte-rendu dans les archives.
 */
@Data
public class ArchiveReportDTO implements Serializable {
	private static final long serialVersionUID = 3189385711534646322L;

	private Long id;
	private Integer year;
	private String midReportTitle;
	private String midReport;
	private String reportTitle;
	private String report;

	public ArchiveReportDTO() {
	}
	
	public ArchiveReportDTO(Long id, Integer year, String midReportTitle, Blob midReport, String reportTitle, Blob report) {
		this.id = id;
		this.year = year;
		this.midReportTitle = midReportTitle;
		if (midReport != null) {
			this.midReport = Converter.blobToString(midReport);
		}
		this.reportTitle = reportTitle;
		if (report != null) {
			this.report = Converter.blobToString(report);
		}		
	}
}
