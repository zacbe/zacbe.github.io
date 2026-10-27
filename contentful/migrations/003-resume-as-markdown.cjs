// The resume becomes one pasted Markdown document plus its PDF, instead of structured entries.
// Deletes the structured resume types (they must have no entries) and creates `resumePage`.
//   npm run migrate -- contentful/migrations/003-resume-as-markdown.cjs

/** @param {import('contentful-migration').default} migration */
module.exports = function (migration) {
  migration.deleteContentType('resume')
  migration.deleteContentType('resumeRole')
  migration.deleteContentType('skillGroup')

  const page = migration
    .createContentType('resumePage')
    .name('Resume')
    .displayField('title')
    .description('Create exactly one entry. Paste the resume Markdown and upload the PDF.')
  page
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true)
    .defaultValue({ 'en-US': 'Resume' })
  page.createField('body').name('Resume (Markdown)').type('Text').required(true)
  page
    .createField('pdf')
    .name('PDF')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([{ linkMimetypeGroup: ['pdfdocument'] }])

  page.changeFieldControl('title', 'builtin', 'singleLine', {
    helpText: 'Only used in Contentful’s entry list.',
  })
  page.changeFieldControl('body', 'builtin', 'markdown', {
    helpText:
      'Paste the whole resume. Summary first, then “# Company, Location”, “**Role | Start - End**”, bullets, “**Stack:** a • b”. The Education/Languages table and a “Keywords:” line fill the sidebar.',
  })
}
