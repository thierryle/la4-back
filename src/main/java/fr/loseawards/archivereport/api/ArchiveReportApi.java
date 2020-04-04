package fr.loseawards.archivereport.api;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import fr.loseawards.AbstractServiceApi;
import fr.loseawards.archivereport.dto.ArchiveReportDTO;
import fr.loseawards.model.ArchiveReport;
import fr.loseawards.util.Converter;

import java.util.List;

public class ArchiveReportApi extends AbstractServiceApi {
	/**
	 * Retourne la liste des comptes-rendus.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archivereports
	 * @return
	 */
	@ApiMethod(path = "archivereports", httpMethod = ApiMethod.HttpMethod.GET)
	public List<ArchiveReportDTO> getArchiveReports() {
		List<ArchiveReport> archiveReports = getPersistenceService().getArchiveReports();

		// Conversion en DTO
		List<ArchiveReportDTO> archiveReportsDTO = Converter.toArchiveReportsDTO(archiveReports);
		return archiveReportsDTO;
	}
	
	/**
	 * Retourne un compte-rendu.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/archivereports/6361774278311936
	 * @param archiveReportId
	 * @return
	 */
	@ApiMethod(path = "archivereports/{archiveReportId}", httpMethod = ApiMethod.HttpMethod.GET)
	public ArchiveReportDTO getArchiveReport(@Named("archiveReportId") final Long archiveReportId) {
		ArchiveReport archiveReport = getPersistenceService().getArchiveReport(archiveReportId);
		if (archiveReport == null) {
			return null;
		}
		return Converter.toDTO(archiveReport);
	}
	
	/**
	 * Crée un compte-rendu.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/archivereports
	 * @param archiveReportDTO
	 * @return
	 */
	@ApiMethod(path = "archivereports", httpMethod = ApiMethod.HttpMethod.POST)
	public ArchiveReportDTO createArchiveReport(final ArchiveReportDTO archiveReportDTO) {
		ArchiveReport archiveReport = Converter.fromDTO(archiveReportDTO);
		getPersistenceService().addArchiveReport(archiveReport);
		
		archiveReportDTO.setId(archiveReport.getId());
		return archiveReportDTO;
	}
	
	/**
	 * Met à jour un compte-rendu.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/archivereports/6361774278311936
	 * @param archiveReportId
	 * @return
	 */
	@ApiMethod(path = "archivereports/{archiveReportId}", httpMethod = ApiMethod.HttpMethod.PUT)
	public void updateArchiveReport(@Named("archiveReportId") final Long archiveReportId, final ArchiveReportDTO archiveReportDTO) {
		ArchiveReport archiveReport = Converter.fromDTO(archiveReportDTO);
		getPersistenceService().updateArchiveReport(archiveReport);
	}
	
	/**
	 * Supprime un compte-rendu.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/archivereports/6361774278311936
	 * @param archiveReportId
	 */
	@ApiMethod(path = "archivereports/{archiveReportId}", httpMethod = ApiMethod.HttpMethod.DELETE)
	public void deleteArchiveReport(@Named("archiveReportId") final Long archiveReportId) {
		getPersistenceService().deleteArchiveReport(archiveReportId);
	}
}
