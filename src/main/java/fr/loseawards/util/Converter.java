package fr.loseawards.util;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.google.appengine.api.datastore.Blob;

import fr.loseawards.avatar.dto.AvatarDTO;
import fr.loseawards.category.dto.CategoryDTO;
import fr.loseawards.comment.dto.CommentDTO;
import fr.loseawards.decision.dto.DecisionDTO;
import fr.loseawards.global.dto.GlobalDTO;
import fr.loseawards.image.dto.ImageDTO;
import fr.loseawards.model.Avatar;
import fr.loseawards.model.Category;
import fr.loseawards.model.Comment;
import fr.loseawards.model.Decision;
import fr.loseawards.model.Global;
import fr.loseawards.model.Image;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.model.Vote;
import fr.loseawards.nomination.dto.NominationDTO;
import fr.loseawards.user.dto.UserDTO;
import fr.loseawards.vote.dto.VoteDTO;

public class Converter {
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	
	// ===== User =====
	
	public static UserDTO toDTO(final User user) {
		return new UserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getAvatarId());
	}
	
	public static List<UserDTO> toUsersDTO(final List<User> users) {
		return users.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static User fromDTO(final UserDTO userDTO) {
		return new User(userDTO.getId(), userDTO.getFirstName(), userDTO.getLastName(), userDTO.getEmail(), userDTO.getAvatarId());
	}
	
	// ===== Nomination =====
	
	public static NominationDTO toDTO(final Nomination nomination) {
		return new NominationDTO(nomination.getId(), nomination.getUsersIdsAsList(), nomination.getCategoryId(), nomination.getReason(), nomination.getDate(), nomination.getImageId());
	}
	
	public static List<NominationDTO> toNominationsDTO(final List<Nomination> nominations) {
		return nominations.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Nomination fromDTO(final NominationDTO nominationDTO) {
		return new Nomination(nominationDTO.getId(), nominationDTO.getUsersIds(), nominationDTO.getCategoryId(), nominationDTO.getReason(), nominationDTO.getDate(), nominationDTO.getImageId());
	}
	
	// ===== Category =====
	
	public static CategoryDTO toDTO(final Category category) {
		return new CategoryDTO(category.getId(), category.getName());
	}
	
	public static List<CategoryDTO> toCategoriesDTO(final List<Category> categories) {
		return categories.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Category fromDTO(final CategoryDTO categoryDTO) {
		return new Category(categoryDTO.getId(), categoryDTO.getName());
	}
	
	// ===== Comment =====
	
	public static CommentDTO toDTO(final Comment comment) {
		return new CommentDTO(comment.getId(), comment.getAuthorId(), dateToString(comment.getDate()), comment.getContent(), comment.getNominationId());
	}
	
	public static List<CommentDTO> toCommentsDTO(final List<Comment> comments) {
		return comments.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Comment fromDTO(final CommentDTO commentDTO) {
		return new Comment(commentDTO.getId(), commentDTO.getAuthorId(), commentDTO.getDate(), commentDTO.getContent(), commentDTO.getNominationId());
	}
	
	// ===== Avatar =====
	
	public static AvatarDTO toDTO(final Avatar avatar) {
		return new AvatarDTO(avatar.getId(), avatar.getImage());
	}
	
	public static List<AvatarDTO> toAvatarsDTO(final List<Avatar> avatars) {
		return avatars.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Image =====
	
	public static ImageDTO toDTO(final Image image) {
		return new ImageDTO(image.getId(), image.getImage());
	}
	
	public static List<ImageDTO> toImagesDTO(final List<Image> images) {
		return images.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Vote =====
	
	public static Vote fromDTO(final VoteDTO voteDTO) {
		return new Vote(voteDTO.getId(), voteDTO.getCategoryId(), voteDTO.getVoterId(), voteDTO.getNominationId(), voteDTO.getReason());
	}
	
	public static VoteDTO toDTO(final Vote vote) {
		return new VoteDTO(vote.getId(), vote.getCategoryId(), vote.getVoterId(), vote.getNominationId(), vote.getReason());
	}
	
	public static List<VoteDTO> toVotesDTO(List<Vote> votes) {
		return votes.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	// ===== Decision =====
	
	public static DecisionDTO toDTO(final Decision decision) {
		return new DecisionDTO(decision.getId(), decision.getCategoryId(), decision.getNominatedId());
	}
	
	public static List<DecisionDTO> toDecisionsDTO(final List<Decision> decisions) {
		return decisions.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Decision fromDTO(final DecisionDTO decisionDTO) {
		return new Decision(decisionDTO.getId(), decisionDTO.getCategoryId(), decisionDTO.getNominatedId());
	}
	
	// ===== Global =====
	
	public static GlobalDTO toDTO(final Global global) {
		return new GlobalDTO(global.getId(), global.getKey(), global.getValue(), global.getValuesIdsAsList());
	}
	
	public static List<GlobalDTO> toGlobalsDTO(final List<Global> globals) {
		return globals.stream().map(Converter::toDTO).collect(Collectors.toList());
	}
	
	public static Global fromDTO(final GlobalDTO globalDTO) {
		return new Global(globalDTO.getId(), globalDTO.getKey(), globalDTO.getValue(), globalDTO.getValuesIds());
	}
	
//	// ===== ArchiveUser =====
//	
//	public static ArchiveUserDTO toDTO(final ArchiveUser user) {
//		return new ArchiveUserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getFirstYear(), user.getLastYear());
//	}
//	
//	public static List<ArchiveUserDTO> toArchiveUsersDTO(final List<ArchiveUser> archiveUsers) {
//		List<ArchiveUserDTO> archiveUsersDTO = new ArrayList<ArchiveUserDTO>();
//		for (ArchiveUser archiveUser: archiveUsers) {
//			archiveUsersDTO.add(toDTO(archiveUser));
//		}
//		return archiveUsersDTO;
//	}
//	
//	public static ArchiveUser fromDTO(final ArchiveUserDTO archiveUserDTO) {
//		ArchiveUser archiveUser = new ArchiveUser();
//		archiveUser.setId(archiveUserDTO.getId());
//		archiveUser.setFirstName(archiveUserDTO.getFirstName());
//		archiveUser.setLastName(archiveUserDTO.getLastName());
//		archiveUser.setFirstYear(archiveUserDTO.getFirstYear());
//		archiveUser.setLastYear(archiveUserDTO.getLastYear());
//		return archiveUser;
//	}
//	
//	// ===== ArchiveCategory =====
//	
//	public static ArchiveCategoryDTO toDTO(final ArchiveCategory archiveCategory) {
//		return new ArchiveCategoryDTO(archiveCategory.getId(), archiveCategory.getName());
//	}
//	
//	public static List<ArchiveCategoryDTO> toArchiveCategoriesDTO(final List<ArchiveCategory> archiveCategories) {
//		List<ArchiveCategoryDTO> archiveCategoriesDTO = new ArrayList<ArchiveCategoryDTO>();
//		for (ArchiveCategory archiveCategory: archiveCategories) {
//			archiveCategoriesDTO.add(toDTO(archiveCategory));
//		}
//		return archiveCategoriesDTO;
//	}
//	
//	public static ArchiveCategory fromDTO(final ArchiveCategoryDTO archiveCategoryDTO) {
//		ArchiveCategory archiveCategory = new ArchiveCategory();
//		archiveCategory.setId(archiveCategoryDTO.getId());
//		archiveCategory.setName(archiveCategoryDTO.getName());
//		return archiveCategory;
//	}
//	
//	// ===== Archive =====
//	
//	public static ArchiveDTO toDTO(final Archive archive, final List<ArchiveRank> archiveRanks) {
//		Map<Integer, List<Long>> ranking = new HashMap<Integer, List<Long>>();
//		if (archiveRanks != null) {
//			for (ArchiveRank archiveRank : archiveRanks) {
//				ranking.put(archiveRank.getPosition(), Arrays.asList(archiveRank.getUsersIds()));
//			}
//		}
//		
//		return new ArchiveDTO(archive.getId(), archive.getYear(), archive.getCategoriesIds(), ranking);
//	}
//	
//	public static List<ArchiveDTO> toArchivesDTO(List<Archive> archives, List<ArchiveRank> archiveRanks) {
//		// Conversion en DTO
//		List<ArchiveDTO> archivesDTO = new ArrayList<ArchiveDTO>();
//		for (Archive archive : archives) {
//			archivesDTO.add(Converter.toDTO(archive, getArchiveRanksOfYear(archive.getYear(), archiveRanks)));
//		}
//		return archivesDTO;
//	}
//	
//	public static List<ArchiveRank> getArchiveRanksOfYear(Integer year, final List<ArchiveRank> archiveRanks) {
//		if (year == null) {
//			return null;
//		}
//		return Util.getSublistByProperty(archiveRanks, "year", year);
//	}
//	
//	public static Archive fromDTO(final ArchiveDTO archiveDTO) {
//		Archive archive = new Archive();
//		archive.setId(archiveDTO.getId());
//		archive.setYear(archiveDTO.getYear());
//		if (archiveDTO.getCategoriesIds() != null) {
//			archive.setCategoriesIds(archiveDTO.getCategoriesIds().toArray(new Long[archiveDTO.getCategoriesIds().size()]));
//		}
//		return archive;
//	}
//	
//	// ===== ArchiveRank =====
//	
//	public static List<ArchiveRank> fromDTO(final Map<Integer, List<Long>> ranking, final Integer year) {
//		if (ranking != null) {
//			List<ArchiveRank> archiveRanks = new ArrayList<ArchiveRank>();
//			for (Integer rank : ranking.keySet()) {
//				ArchiveRank archiveRank = new ArchiveRank(null, year, rank, ranking.get(rank));
//				archiveRanks.add(archiveRank);
//			}
//			return archiveRanks;
//		}
//		return null;
//	}
//	
//	// ===== ArchiveAward =====
//	
//	public static ArchiveAwardDTO toDTO(final ArchiveAward archiveAward) {
//		return new ArchiveAwardDTO(archiveAward.getId(), archiveAward.getYear(), archiveAward.getCategoryId(), archiveAward.getUsersIds(), archiveAward.getReason());
//	}
//	
//	public static List<ArchiveAwardDTO> toArchiveAwardsDTO(final List<ArchiveAward> archiveAwards) {
//		List<ArchiveAwardDTO> archiveAwardsDTO = new ArrayList<ArchiveAwardDTO>();
//		for (ArchiveAward archiveAward : archiveAwards) {
//			archiveAwardsDTO.add(toDTO(archiveAward));
//		}
//		return archiveAwardsDTO;
//	}
//	
//	public static ArchiveAward fromDTO(final ArchiveAwardDTO archiveAwardDTO) {
//		ArchiveAward archiveAward = new ArchiveAward();
//		archiveAward.setId(archiveAwardDTO.getId());
//		archiveAward.setYear(archiveAwardDTO.getYear());
//		archiveAward.setCategoryId(archiveAwardDTO.getCategoryId());
//		if (archiveAwardDTO.getUsersIds() != null) {
//			archiveAward.setUsersIds(archiveAwardDTO.getUsersIds().toArray(new Long[archiveAwardDTO.getUsersIds().size()]));
//		}
//		archiveAward.setReason(archiveAwardDTO.getReason());
//		return archiveAward;
//	}
//
//	// ===== ArchiveReport =====
//	
//	public static ArchiveReportDTO toDTO(final ArchiveReport archiveReport) {
//		return new ArchiveReportDTO(archiveReport.getId(), archiveReport.getYear(), archiveReport.getReport());
//	}
//
//	public static List<ArchiveReportDTO> toArchiveReportsDTO(final List<ArchiveReport> archiveReports) {
//		List<ArchiveReportDTO> archiveReportsDTO = new ArrayList<ArchiveReportDTO>();
//		for (ArchiveReport archiveReport : archiveReports) {
//			archiveReportsDTO.add(toDTO(archiveReport));
//		}
//		return archiveReportsDTO;
//	}
//	
//	public static ArchiveReport fromDTO(final ArchiveReportDTO archiveReportDTO) {
//		ArchiveReport archiveReport = new ArchiveReport();
//		archiveReport.setId(archiveReportDTO.getId());
//		archiveReport.setYear(archiveReportDTO.getYear());
//		archiveReport.setReport(stringToBlob(archiveReportDTO.getReport()));
//		return archiveReport;
//	}
	
	// ===== Blob =====
	
	public static String blobToString(final Blob blob) {
		try {
			return new String(blob.getBytes(), "UTF8");
		} catch (UnsupportedEncodingException e) {
			throw new IllegalArgumentException("Erreur dans la conversion", e);
		}
	}
	
	public static Blob stringToBlob(final String string) {
		try {
			return new Blob(string.getBytes("UTF-8"));
		} catch (UnsupportedEncodingException e) {
			throw new IllegalArgumentException("Erreur dans la conversion", e);
		}
	}
	
	// ===== Date =====
	
	public static String dateToString(final Date date) {
		return dateFormat.format(date);
	}
	
	public static Date stringToDate(final String string) {
		try {
			return dateFormat.parse(string);
		} catch (ParseException e) {
			throw new IllegalArgumentException("Mauvais format de date", e);
		}
	}
}
