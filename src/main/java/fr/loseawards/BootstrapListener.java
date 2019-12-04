package fr.loseawards;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.googlecode.objectify.ObjectifyService;

import fr.loseawards.model.Avatar;
import fr.loseawards.model.Category;
import fr.loseawards.model.Comment;
import fr.loseawards.model.Decision;
import fr.loseawards.model.Global;
import fr.loseawards.model.Image;
import fr.loseawards.model.Nomination;
import fr.loseawards.model.User;
import fr.loseawards.model.Vote;

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
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

}
