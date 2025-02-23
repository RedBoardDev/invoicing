import createEmailTemplateRoute from '@routes/email-templates/create-template';
import deleteEmailTemplateRoute from '@routes/email-templates/delete-template';
import getEmailTemplateRoute from '@routes/email-templates/get-template';
import listEmailTemplatesRoute from '@routes/email-templates/list-templates';
import simulateTemplateRoute from '@routes/email-templates/simulate-template';
import updateEmailTemplateRoute from '@routes/email-templates/update-template';
import type { FastifyInstance } from 'fastify';

const templatesRoutes = async (app: FastifyInstance): Promise<void> => {
  app.register(createEmailTemplateRoute);
  app.register(deleteEmailTemplateRoute);
  app.register(getEmailTemplateRoute);
  app.register(listEmailTemplatesRoute);
  app.register(updateEmailTemplateRoute);
  app.register(simulateTemplateRoute);
};

export default templatesRoutes;
