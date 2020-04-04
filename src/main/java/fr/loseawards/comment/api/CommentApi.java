package fr.loseawards.comment.api;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.Named;

import fr.loseawards.AbstractServiceApi;
import fr.loseawards.comment.dto.CommentBundleDTO;
import fr.loseawards.comment.dto.CommentDTO;
import fr.loseawards.model.Comment;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.util.Converter;
import fr.loseawards.util.Util;

public class CommentApi extends AbstractServiceApi {
	protected static int MAX_COMMENTS = 10;
	
	/**
	 * Retourne tous les commentaires.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/comments
	 * @return
	 */
	@ApiMethod(path = "comments", httpMethod = HttpMethod.GET)
	public List<CommentDTO> getComments() {
		// Récupération des commentaires dans la base
		List<Comment> comments = getPersistenceService().getComments();

		// Conversion en DTO
		return Converter.toCommentsDTO(comments);
	}
	
	/**
	 * Récupère un commentaire.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/comments/6641050231767040
	 * @param commentId
	 * @return
	 */
	@ApiMethod(path = "comments/{commentId}", httpMethod = HttpMethod.GET)
	public CommentDTO getComment(@Named("commentId") final Long commentId) {
		Comment comment = getPersistenceService().getComment(commentId);
		if (comment == null) {
			return null;
		}
		return Converter.toDTO(comment);
	}
	
	/**
	 * Retourne les commentaires regroupés par nomination.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/comments/group
	 * @return
	 */
	@ApiMethod(path = "comments/group", httpMethod = HttpMethod.GET)
	public CommentBundleDTO getCommentsByNominations() {
		List<Comment> comments = getPersistenceService().getComments();
		
		// Conversion en DTO
		List<CommentDTO> commentsDTO = Converter.toCommentsDTO(comments);
		
		CommentBundleDTO commentBundleDTO = new CommentBundleDTO();
		commentBundleDTO.setComments(Util.groupByProperty(commentsDTO, "nominationId"));
		return commentBundleDTO;
	}
	
	/**
	 * Retourne les derniers commentaires regroupés par nomination.
	 * GET http://localhost:8080/_ah/api/loseawards/v1/comments/groupLatest
	 * @return
	 */
	@ApiMethod(path = "comments/groupLatest", httpMethod = HttpMethod.GET)
	public CommentBundleDTO getLatestCommentsByNominations() {
		Map<Long, List<CommentDTO>> commentsByNomination = new HashMap<Long, List<CommentDTO>>();
		
		List<Comment> comments = getPersistenceService().getComments();
		int nbComments = 0;
		int index = 0;
		
		// On parcourt les commentaires en commençant par les plus récents
		while (nbComments < MAX_COMMENTS && index < comments.size()) {
			Comment comment = comments.get(index);
			
			if (commentsByNomination.get(comment.getNominationId()) == null) {
				// Pour chaque commentaire, il faut récupérer tous les commentaires de la même nomination
				List<Comment> commentsOfOneNomination = Util.getSublistByProperty(comments, "nominationId", comment.getNominationId());
				commentsByNomination.put(comment.getNominationId(), Converter.toCommentsDTO(commentsOfOneNomination));
				nbComments += commentsOfOneNomination.size();
			}
			index++;
		}
		
		CommentBundleDTO commentBundleDTO = new CommentBundleDTO();
		commentBundleDTO.setComments(commentsByNomination);
		return commentBundleDTO;
	}
	
	/**
	 * Crée un commentaire.
	 * POST http://localhost:8080/_ah/api/loseawards/v1/comments
	 * @param commentDTO
	 * @return
	 */
	@ApiMethod(path = "comments", httpMethod = HttpMethod.POST)
	public CommentDTO createComment(final CommentDTO commentDTO) {
		Comment comment = Converter.fromDTO(commentDTO);
		comment.setDate(new Date());
		getPersistenceService().addComment(comment);
		sendNotification(comment);
		
		commentDTO.setId(comment.getId());
		commentDTO.setDate(Converter.dateToString(comment.getDate()));
		return commentDTO;
	}
	
	/**
	 * Supprime un commentaire.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/comments/4859841394769920
	 * @param commentId
	 */
	@ApiMethod(path = "comments/{commentId}", httpMethod = HttpMethod.DELETE)
	public void deleteComment(@Named("commentId") final Long commentId) {
		getPersistenceService().deleteComment(commentId);
	}
	
	/**
	 * Supprime tous les commentaires.
	 * DELETE http://localhost:8080/_ah/api/loseawards/v1/comments
	 */
	@ApiMethod(path = "comments", httpMethod = HttpMethod.DELETE)
	public void deleteComments() {
		getPersistenceService().deleteComments();
	}
	
	/**
	 * Met à jour un commentaire.
	 * PUT http://localhost:8080/_ah/api/loseawards/v1/comments/6641050231767040
	 * @param commentId
	 * @param commentDTO
	 * @return
	 */
	@ApiMethod(path = "comments/{idComment}", httpMethod = HttpMethod.PUT)
	public CommentDTO updateComment(@Named("commentId") final Long commentId, final CommentDTO commentDTO) {
		Comment comment = Converter.fromDTO(commentDTO);
		comment.setDate(new Date());
		getPersistenceService().updateComment(comment);
		
		commentDTO.setDate(Converter.dateToString(comment.getDate()));
		return commentDTO;
	}
	
	/**
	 * Envoi d'une notification pour un nouveau commentaire.
	 * @param comment
	 */
	protected String sendNotification(final Comment comment) {
		List<User> users = getPersistenceService().getUsers();
		Nomination nomination = getPersistenceService().getNomination(comment.getNominationId());
		
		StringBuilder builder = new StringBuilder("<p>");
		builder.append(Util.getObjectById(users, comment.getAuthorId()).getDisplayName());
		builder.append(" a commenté la nomination \"");
		builder.append(nomination.getReason());
		builder.append("\" :</p>\n<p><i>");
		builder.append(comment.getContent());
		builder.append("</i></p>\n<a href=\"http://loseawards.appspot.com\">http://loseawards.appspot.com</a>");
		String message = builder.toString();
		
		for (User user : users) {
			if (user.getEmail() != null && !user.getEmail().isEmpty()) {
				sendMail(user.getEmail(), user.getDisplayName(), "Nouveau commentaire", message, true);
			}
		}
		
		return message;
	}
}
