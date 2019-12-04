package fr.loseawards.global.api;

import java.util.ArrayList;
import java.util.List;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.global.dto.GlobalBundleDTO;
import fr.loseawards.global.dto.GlobalDTO;
import fr.loseawards.model.Global;
import fr.loseawards.model.GlobalKey;
import fr.loseawards.util.Converter;

public class GlobalApi extends AbstractServiceApi {
	/**
	 * Récupère toutes les variables globales.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/globals
	 * @return
	 */
	@ApiMethod(path = "globals", httpMethod = HttpMethod.GET)
	public List<GlobalDTO> getGlobals() {
		List<GlobalDTO> globalsDTO = new ArrayList<GlobalDTO>();
		
		for (GlobalKey globalKey : GlobalKey.values()) {
			Global global = getPersistenceService().getGlobalByKey(globalKey.getKey());
			if (global == null) {
				// Initialisation
				global = new Global();
				global.setKey(globalKey.getKey());
				getPersistenceService().addGlobal(global);
			}
			globalsDTO.add(Converter.toDTO(global));
		}
		return globalsDTO;
	}
	
	/**
	 * Récupère une variable globale.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/globals/6641050231767040
	 * @param userId
	 * @return
	 */
	@ApiMethod(path = "globals/{globalId}", httpMethod = HttpMethod.GET)
	public GlobalDTO getGlobal(@Named("globalId") final Long globalId) {
		Global global = getPersistenceService().getGlobal(globalId);
		if (global == null) {
			return null;
		}
		return Converter.toDTO(global);
	}
	
	/**
	 * Crée une variable globale.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/globals
	 * @param globalDTO
	 * @return
	 */
	@ApiMethod(path = "globals", httpMethod = HttpMethod.POST)
	public GlobalDTO createGlobal(final GlobalDTO globalDTO) {
		Global global = Converter.fromDTO(globalDTO);
		getPersistenceService().addGlobal(global);
		globalDTO.setId(global.getId());
		return globalDTO;
	}
	
	/**
	 * Supprime une variable globale.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/globals/6641050231767040
	 * @param idUser
	 */
	@ApiMethod(path = "globals/{globalId}", httpMethod = HttpMethod.DELETE)
	public void deleteGlobal(@Named("globalId") final Long globalId) {
		getPersistenceService().deleteGlobal(globalId);
	}
	
	/**
	 * Supprime toutes les variables globales.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/globals
	 */
	@ApiMethod(path = "globals", httpMethod = HttpMethod.DELETE)
	public void deleteGlobals() {
		getPersistenceService().deleteGlobals();
	}
	
	/**
	 * Met à jour une variable globale.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/globals/6641050231767040
	 * @param globalId
	 * @param globalDTO
	 * @return
	 */
	@ApiMethod(path = "globals/{globalId}", httpMethod = HttpMethod.PUT)
	public void updateGlobal(@Named("globalId") final Long idGlobal, final GlobalDTO globalDTO) {
		getPersistenceService().updateGlobal(Converter.fromDTO(globalDTO));
	}
	
	/**
	 * Met à jour un ensemble de variables globales.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/globals
	 * @param globalsDTO
	 */
	@ApiMethod(path = "globals/bulk", httpMethod = HttpMethod.PUT)
	public void updateGlobals(GlobalBundleDTO globalBundleDTO) {
		if (globalBundleDTO.getGlobals() != null) {
			globalBundleDTO.getGlobals().forEach(globalDTO -> {
				getPersistenceService().updateGlobal(Converter.fromDTO(globalDTO));
			});
		}
//		for (GlobalDTO globalDTO: globalsDTO) {
//			getPersistenceService().updateGlobal(Converter.fromDTO(globalDTO));
//		}		
	}
}
