package fr.loseawards;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.googlecode.objectify.ObjectifyService;

import fr.loseawards.model.*;

@WebListener
public class BootstrapListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
//		ObjectifyService.init();
        ObjectifyService.register(User.class);
        ObjectifyService.register(Category.class);
        ObjectifyService.register(Image.class);
        ObjectifyService.register(Avatar.class);
        ObjectifyService.register(Nomination.class);
        ObjectifyService.register(Global.class);
        ObjectifyService.register(Comment.class);
        ObjectifyService.register(Vote.class);
        ObjectifyService.register(Decision.class);
        ObjectifyService.register(ArchiveUser.class);
        ObjectifyService.register(ArchiveCategory.class);
        ObjectifyService.register(Archive.class);
        ObjectifyService.register(ArchiveRank.class);
        ObjectifyService.register(ArchiveAward.class);
        ObjectifyService.register(ArchiveRank.class);
        ObjectifyService.register(ArchiveReport.class);
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

}
