import 'dotenv/config';
import { getArchiveImages } from '../src/lib/archive.ts';
import { getArchiveProjects } from '../src/lib/projects.ts';
import { getHomepageActivities } from '../src/lib/books.ts';

async function main() {
  console.log('========================================');
  console.log('Caching Notion images (this may take a minute...)');
  console.log('========================================');

  console.log('\n[1/3] Fetching archive images...');
  const archiveImages = await getArchiveImages(true);
  console.log(`Archive images processed: ${archiveImages.length}`);

  console.log('\n[2/3] Fetching project images...');
  const projects = await getArchiveProjects(true);
  const projectImageCount = projects.reduce((count, project) => {
    return (
      count +
      (project.coverImage ? 1 : 0) +
      (project.screenshots?.length || 0)
    );
  }, 0);
  console.log(`Projects processed: ${projects.length}`);
  console.log(`Project images processed: ${projectImageCount}`);

  console.log('\n[3/3] Fetching activity images...');
  const activities = await getHomepageActivities(true);
  console.log(`Activity images processed: ${activities.length}`);

  console.log('\n========================================');
  console.log('Notion image caching complete');
  console.log('========================================');
}

main().catch((error) => {
  console.error('\nNotion image caching failed:');
  console.error(error);
  process.exit(1);
});