package fr.loseawards.model;

import com.google.appengine.api.datastore.Blob;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import lombok.Data;

import javax.jdo.annotations.*;
import java.io.Serializable;

/**
 * Classe représentant un rapport.
 */
@Entity
@Data
public class ArchiveReport {
	@Id
	protected Long id;

	@Index
	protected Integer year;

	protected String midReportTitle;

	protected Blob midReport;

	protected String reportTitle;

	protected Blob report;
	
	public ArchiveReport() {
	}
	
	public ArchiveReport(Long id, Integer year, String midReportTitle, Blob midReport, String reportTitle, Blob report) {
		this.id = id;
		this.year = year;
		this.midReportTitle = midReportTitle;
		this.midReport = midReport;
		this.reportTitle = reportTitle;
		this.report = report;
	}
}
