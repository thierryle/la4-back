package fr.loseawards.nomination.api;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.model.Category;
import fr.loseawards.model.Image;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.nomination.dto.NominationBundleDTO;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.util.Converter;
import fr.loseawards.util.Util;

public class NominationApi extends AbstractServiceApi {
	/**
	 * Récupère toutes les nominations.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/nominations
	 * @return
	 */
	@ApiMethod(path = "nominations", httpMethod = HttpMethod.GET)
	public List<NominationDTO> getNominations() {
		// Récupération des nominations dans la base		
		List<Nomination> nominations = getPersistenceService().getNominations();

		// Conversion en DTO
		return Converter.toNominationsDTO(nominations);
	}
	
	/**
	 * Récupère une nomination.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/nominations/6641050231767040
	 * @param nominationId
	 * @return
	 */
	@ApiMethod(path = "nominations/{nominationId}", httpMethod = HttpMethod.GET)
	public NominationDTO getNomination(@Named("nominationId") final Long nominationId) {
		Nomination nomination = getPersistenceService().getNomination(nominationId);
		if (nomination == null) {
			return null;
		}
		return Converter.toDTO(nomination);
	}
	
	/**
	 * Retourne le bundle nécessaire à l'affichage de la page des nominations.
	 * GET http://localhost:8080/_ah/api/nominations/v1/users/bundle
	 * @return
	 */
	@ApiMethod(path = "nominations/bundle", httpMethod = HttpMethod.GET)
	public NominationBundleDTO getNominationBundle() {
		NominationBundleDTO nominationBundleDTO = new NominationBundleDTO();
		
		// Récupération de toutes les nominations
		List<Nomination> nominations = getPersistenceService().getNominations();
		
		// Conversion en DTO et regroupement par catégorie
		List<NominationDTO> nominationsDTO = Converter.toNominationsDTO(nominations);
		Map<Long, List<NominationDTO>> nominationsByCategory = Util.groupByProperty(nominationsDTO, "categoryId");
		nominationBundleDTO.setNominations(nominationsByCategory);		
		return nominationBundleDTO;
	}
	
	/**
	 * Crée une nomination.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/nominations
	 * @param nominationDTO
	 * @return
	 */
	@ApiMethod(path = "nominations", httpMethod = HttpMethod.POST)
	public NominationDTO createNomination(final NominationDTO nominationDTO) {
		Nomination nomination = Converter.fromDTO(nominationDTO);
		
		// Image
		if (nominationDTO.getImage() != null) {
			// L'utilisateur a uploadé une image : on l'enregistre, puis on récupère son ID
			Image image = new Image();
			image.setImage(nominationDTO.getImage());
			getPersistenceService().addImage(image);
			
			nomination.setImageId(image.getId());
			nominationDTO.setImageId(image.getId());
			nominationDTO.setImage(null);
		}

		nomination.setDate(new Date());
		getPersistenceService().addNomination(nomination);
		sendNotification(nomination);
		
		nominationDTO.setId(nomination.getId());
		return nominationDTO;
	}
	
	/**
	 * Supprime une nomination.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/nominations/6641050231767040
	 * @param idUser
	 */
	@ApiMethod(path = "nominations/{nominationId}", httpMethod = HttpMethod.DELETE)
	public void deleteNomination(@Named("nominationId") final Long nominationId) {
		getPersistenceService().deleteNomination(nominationId);
	}
	
	/**
	 * Supprime toutes les nominations.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/nominations
	 */
	@ApiMethod(path = "nominations", httpMethod = HttpMethod.DELETE)
	public void deleteNominations() {
		getPersistenceService().deleteNominations();
	}
	
	/**
	 * Met à jour une nomination.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/nominations/6641050231767040
	 * @param nominationId
	 * @param nominationDTO
	 * @return
	 */
	@ApiMethod(path = "nominations/{nominationId}", httpMethod = HttpMethod.PUT)
	public NominationDTO updateNomination(@Named("nominationId") final Long nominationId, final NominationDTO nominationDTO) {
		Nomination nomination = Converter.fromDTO(nominationDTO);
		
		// Image
		if (nominationDTO.getImage() != null) {
			// L'utilisateur a uploadé une image : on l'enregistre, puis on récupère son ID
			Image image = new Image();
			image.setImage(nominationDTO.getImage());
			getPersistenceService().addImage(image);
			
			nomination.setImageId(image.getId());
			nominationDTO.setImageId(image.getId());
			nominationDTO.setImage(null);
		}
		
		nomination.setDate(new Date());
		getPersistenceService().updateNomination(nomination);
		
		return nominationDTO;
	}
	
	/**
	 * Envoie un mail avec toutes les nominations.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/nominations/mail?address=thierry.le@gmail.com
	 * @param address
	 * @return
	 */
	@ApiMethod(path = "nominations/mail", httpMethod = HttpMethod.PUT)
	public void sendMail(@Named("address") final String address) {
		Calendar dateDuJour = Calendar.getInstance();
		int annee = dateDuJour.get(Calendar.YEAR);
		
		StringBuilder message = new StringBuilder("<ul>\n"); 
		
		// Utilisateurs, catégories et nominations
		List<User> users = getPersistenceService().getUsers();
		List<Category> categories = getPersistenceService().getCategories();
		List<Nomination> nominations = getPersistenceService().getNominations();
		
		// Parcours des catégories
//		for (Category category : categories) {
		categories.forEach(category -> {
			message.append("  <li>\n    <b>Catégorie ");
			message.append(category.getName());
			message.append("</b>\n    <ul>\n");
			
			// Parcours des nominations
//			for (Nomination nomination : nominations) {
			nominations.forEach(nomination -> {
				if (nomination.getCategoryId().equals(category.getId())) {
					message.append("      <li>");
					message.append(Util.getUsersNames(users, nomination.getUsersIdsAsLong()));
					message.append(" (");
					message.append(nomination.getReason());
					message.append(")</li>\n");
				}
			});
			
			message.append("    </ul>\n  </li>\n");
		});
		
		message.append("</ul>\n<a href=\"http://loseawards.appspot.com\">http://loseawards.appspot.com</a>");
		
		sendMail(address, address, "Nominations " + annee, message.toString(), true);
//		return message.toString();
	}
	
	/**
	 * Envoi d'une notification pour une nouvelle nomination.
	 * @param nomination
	 */
	protected String sendNotification(final Nomination nomination) {
		List<User> users = getPersistenceService().getUsers();
		Category category = getPersistenceService().getCategory(nomination.getCategoryId());
		
		StringBuilder message = new StringBuilder("<p>");
		message.append(Util.getUsersNames(users, nomination.getUsersIdsAsLong()));
		if (nomination.getUsersIds().size() > 1) {
			message.append(" ont été nominés dans la catégorie ");
		} else {
			message.append(" a été nominé dans la catégorie ");
		}
		message.append(category.getName());
		message.append(" (");
		message.append(nomination.getReason());
		message.append(")</p>\n<a href=\"http://loseawards.appspot.com\">http://loseawards.appspot.com</a>");
		
		for (User user : users) {
			if (user.getEmail() != null && !user.getEmail().isEmpty()) {
				sendMail(user.getEmail(), user.getDisplayName(), "Nouvelle nomination", message.toString(), true);
			}
		}
		return message.toString();
	}
}
