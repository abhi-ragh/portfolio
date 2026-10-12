import { getArchiveImages } from '../src/lib/archive.ts';
import { getArchiveProjects } from '../src/lib/projects.ts';

async function main() {
  console.log('========================================');
  console.log('Caching Notion images');
  console.log('========================================');

  console.log('\n[1/2] Fetching archive images...');

  const archiveImages = await getArchiveImages();

  console.log(
    `Archive images processed: ${archiveImages.length}`
  );

  console.log('\n[2/2] Fetching project images...');

  const projects = await getArchiveProjects();

  const projectImageCount = projects.reduce((count, project) => {
    return (
      count +
      (project.coverImage ? 1 : 0) +
      (project.screenshots?.length || 0)
    );
  }, 0);

  console.log(
    `Projects processed: ${projects.length}`
  );

  console.log(
    `Project images processed: ${projectImageCount}`
  );

  console.log('\n========================================');
  console.log('Notion image caching complete');
  console.log('========================================');
}

main().catch((error) => {
  console.error('\nNotion image caching failed:');
  console.error(error);
  process.exit(1);
});