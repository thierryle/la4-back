package fr.loseawards.decision.api;

import java.util.Collections;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.cache.Cache;
import javax.cache.CacheException;
import javax.cache.CacheFactory;
import javax.cache.CacheManager;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.decision.dto.DecisionBundleDTO;
import fr.loseawards.decision.dto.DecisionDTO;
import fr.loseawards.model.Decision;
import fr.loseawards.util.Converter;

public class DecisionApi extends AbstractServiceApi {
	private final Logger log = Logger.getLogger(DecisionApi.class.getName());
	private Cache cachedDecisions = null;
	
	public DecisionApi() {
		// Initialisation du cache
		try {
            CacheFactory cacheFactory = CacheManager.getInstance().getCacheFactory();
            cachedDecisions = cacheFactory.createCache(Collections.emptyMap());
        } catch (CacheException e) {
        	// Pas bloquant
        	log.log(Level.WARNING, "Problème dans la création des caches", e);
        }
	}
	
	protected Cache getCachedDecisions() {
		return cachedDecisions;
	}
	
	/**
	 * Crée un ensemble de décisions.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/decisions/bulk
	 * @param decisionBundleDTO
	 */
	@SuppressWarnings("unchecked")
	@ApiMethod(path = "decisions/bulk", httpMethod = HttpMethod.POST)
	public void createDecisions(final DecisionBundleDTO decisionBundleDTO) {
		List<DecisionDTO> decisionsDTO = decisionBundleDTO.getDecisions();
		
		// Suppression des décisions précédentes du président
		getPersistenceService().deleteDecisions();

		// Sauvegarde en base
		decisionsDTO.forEach(decisionDTO -> {
//		for (DecisionDTO decisionDto: decisionsDTO) {
			getPersistenceService().addDecision(Converter.fromDTO(decisionDTO));
		});
		
		// Mise en cache
		getCachedDecisions().put(0L, decisionsDTO);
	}
	
	/**
	 * Retourne toutes les décisions.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/decisions
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@ApiMethod(path = "decisions", httpMethod = HttpMethod.GET)
	public List<DecisionDTO> getDecisions() {
		// Récupération des décisions en cache
		List<DecisionDTO> decisionsDTO = (List<DecisionDTO>) getCachedDecisions().get(0L);
		if (decisionsDTO != null) {
			return decisionsDTO;
		}
		
		// Récupération des décisions en base
		List<Decision> decisions = getPersistenceService().getDecisions();
		
		// Conversion en DTO
		return Converter.toDecisionsDTO(decisions);
	}
	
	/**
	 * Retourne une décision.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/decisions/6641050231767040
	 * @param decisionId
	 * @return
	 */
	@ApiMethod(path = "decisions/{decisionId}", httpMethod = HttpMethod.GET)
	public DecisionDTO getDecision(@Named("decisionId") final Long decisionId) {
		Decision decision = getPersistenceService().getDecision(decisionId);
		if (decision == null) {
			return null;
		}
		
		// Conversion en DTO
		return Converter.toDTO(decision);
	}
	
	/**
	 * Supprime une décision.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/decisions/6641050231767040
	 * @param decisionId
	 * @return
	 */
	@ApiMethod(path = "decisions/{decisionId}", httpMethod = HttpMethod.DELETE)
	public void deleteDecision(@Named("decisionId") final Long decisionId) {
		getPersistenceService().deleteDecision(decisionId);
	}
	
	/**
	 * Supprime toutes les décisions.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/decisions
	 */
	@ApiMethod(path = "decisions", httpMethod = HttpMethod.DELETE)
	public void deleteDecisions() {
		getPersistenceService().deleteDecisions();
	}
}
