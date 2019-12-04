package fr.loseawards.image.api;

import java.util.List;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.image.dto.ImageBundleDTO;
import fr.loseawards.image.dto.ImageDTO;
import fr.loseawards.model.Image;
import fr.loseawards.model.Nomination;
import fr.loseawards.util.Converter;

public class ImageApi extends AbstractServiceApi {
	/**
	 * Récupère toutes les images.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/images
	 * @return
	 */
	@ApiMethod(path = "images", httpMethod = HttpMethod.GET)
	public List<ImageDTO> getImages() {
		// Récupération des images dans la base		
		List<Image> images = getPersistenceService().getImages();

		// Conversion en DTO
		return Converter.toImagesDTO(images);
	}
	
	/**
	 * Supprime une image.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/images/6641050231767040
	 * @param idUser
	 */
	@ApiMethod(path = "images/{imageId}", httpMethod = HttpMethod.DELETE)
	public void deleteImage(@Named("imageId") final Long imageId) {
		getPersistenceService().deleteImage(imageId);
	}
	
	/**
	 * Retourne le bundle nécessaire à la page des images.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/images/bundle
	 * @return
	 */
	@ApiMethod(path = "images/bundle", httpMethod = HttpMethod.GET)
	public ImageBundleDTO getImageBundle() {
		ImageBundleDTO imageBundleDTO = new ImageBundleDTO();
		
		List<Nomination> nominations = getPersistenceService().getNominationsWithImage(); 
		
		// Conversion en DTO
		imageBundleDTO.setNominations(Converter.toNominationsDTO(nominations));
		
		return imageBundleDTO;
	}
}
