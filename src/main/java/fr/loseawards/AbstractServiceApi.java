package fr.loseawards;

import com.google.api.server.spi.config.Api;

import fr.loseawards.persistence.PersistenceService;
import fr.loseawards.util.Util;

@Api(name = "loseawards", version = "v1")
public class AbstractServiceApi {
	/**
	 * Retourne le service de persistance.
	 * @return
	 */
	protected PersistenceService getPersistenceService() {
		return PersistenceService.getInstance();
	}
	
	/**
	 * Envoi de mail.
	 * @param address
	 * @param name
	 * @param subject
	 * @param message
	 * @param isHtml
	 */
	protected void sendMail(final String address, final String name, final String subject, final String message, final boolean isHtml) {
		Util.sendMail(address, name, subject, message, isHtml);
	}
}
