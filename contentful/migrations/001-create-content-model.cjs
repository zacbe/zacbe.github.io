// Creates the content model for the redesigned site (see handoff/DESIGN.md §3).
// Run once against an environment that doesn't have these types yet:
//   npm run migrate -- contentful/migrations/001-create-content-model.cjs

const SLUG = { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' }, message: 'lowercase-with-dashes' }
const MONTH = { format: 'dateonly' }

/** @param {import('contentful-migration').default} migration */
module.exports = function (migration) {
  // --- link: a titled URL, used for TIL sources ----------------------------
  const link = migration
    .createContentType('link')
    .name('Link')
    .displayField('title')
    .description('A titled URL. Used for TIL sources.')
  link.createField('title').name('Title').type('Symbol').required(true)
  link
    .createField('url')
    .name('URL')
    .type('Symbol')
    .required(true)
    .validations([{ regexp: { pattern: '^https?://\\S+$' }, message: 'Must be an http(s) URL' }])

  // --- project ---------------------------------------------------------------
  const project = migration
    .createContentType('project')
    .name('Project')
    .displayField('title')
    .description('A weekend project with a write-up.')
  project.createField('title').name('Title').type('Symbol').required(true)
  project
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, SLUG])
  project
    .createField('summary')
    .name('Summary')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 200 } }])
  project
    .createField('status')
    .name('Status')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['in-progress', 'shipped', 'archived'] }])
  project.createField('featured').name('Featured').type('Boolean').required(true)
  project.createField('stack').name('Stack').type('Array').items({ type: 'Symbol' })
  project.createField('started').name('Started').type('Date').required(true)
  project.createField('updated').name('Updated').type('Date').required(true)
  project.createField('timeSpent').name('Time spent').type('Symbol')
  project
    .createField('codeUrl')
    .name('Code URL')
    .type('Symbol')
    .validations([{ regexp: { pattern: '^https?://\\S+$' } }])
  project
    .createField('demoUrl')
    .name('Demo URL')
    .type('Symbol')
    .validations([{ regexp: { pattern: '^https?://\\S+$' } }])
  project
    .createField('cover')
    .name('Cover')
    .type('Link')
    .linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }])
  project.createField('body').name('Body').type('Text').required(true)

  project.changeFieldControl('slug', 'builtin', 'slugEditor', { trackingFieldId: 'title' })
  project.changeFieldControl('status', 'builtin', 'dropdown')
  project.changeFieldControl('featured', 'builtin', 'boolean')
  project.changeFieldControl('stack', 'builtin', 'tagEditor')
  project.changeFieldControl('started', 'builtin', 'datePicker', MONTH)
  project.changeFieldControl('updated', 'builtin', 'datePicker', MONTH)
  project.changeFieldControl('body', 'builtin', 'markdown', {
    helpText: '## Why I built it · ## How it works · ## What was hard · ## What I’d do differently',
  })

  // --- til -------------------------------------------------------------------
  const til = migration
    .createContentType('til')
    .name('TIL')
    .displayField('title')
    .description('Today I learned: a short note, 100–300 words.')
  til.createField('title').name('Title').type('Symbol').required(true)
  til
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }, SLUG])
  til.createField('date').name('Date').type('Date').required(true)
  til
    .createField('tags')
    .name('Tags')
    .type('Array')
    .items({ type: 'Symbol', validations: [SLUG] })
  til
    .createField('summary')
    .name('Summary')
    .type('Symbol')
    .required(true)
    .validations([{ size: { max: 200 } }])
  til
    .createField('project')
    .name('Project')
    .type('Link')
    .linkType('Entry')
    .validations([{ linkContentType: ['project'] }])
  til.createField('body').name('Body').type('Text').required(true)
  til.createField('gotcha').name('Gotcha').type('Text')
  til
    .createField('sources')
    .name('Sources')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['link'] }] })

  til.changeFieldControl('slug', 'builtin', 'slugEditor', { trackingFieldId: 'title' })
  til.changeFieldControl('date', 'builtin', 'datePicker', { format: 'dateonly' })
  til.changeFieldControl('tags', 'builtin', 'tagEditor')
  til.changeFieldControl('body', 'builtin', 'markdown', {
    helpText: 'Context paragraph · ## What I learned (with a code block) · ## Why it matters',
  })
  til.changeFieldControl('gotcha', 'builtin', 'markdown', {
    helpText: 'Optional. Rendered as the “gotcha” callout at the end.',
  })

  // --- idea: “next up” cards on /projects -----------------------------------
  const idea = migration
    .createContentType('idea')
    .name('Idea')
    .displayField('title')
    .description('Something to build next. Shown as the “next up” card on /projects.')
  idea.createField('title').name('Title').type('Symbol').required(true)
  idea.createField('why').name('Why').type('Symbol').required(true)

  // --- siteSettings (single entry) ------------------------------------------
  const site = migration
    .createContentType('siteSettings')
    .name('Site settings')
    .displayField('name')
    .description('Create exactly one entry. Name, contact links, status and the Now box.')
  site.createField('name').name('Name').type('Symbol').required(true)
  site.createField('role').name('Role').type('Symbol').required(true)
  site.createField('location').name('Location').type('Symbol')
  site.createField('openToWork').name('Open to work').type('Boolean').required(true)
  site.createField('email').name('Email').type('Symbol').required(true)
  site.createField('githubUrl').name('GitHub URL').type('Symbol')
  site.createField('linkedinUrl').name('LinkedIn URL').type('Symbol')
  site.createField('nowBuilding').name('Now: building').type('Symbol')
  site.createField('nowLearning').name('Now: learning').type('Symbol')
  site.createField('nowReading').name('Now: reading').type('Symbol')
  site.createField('nowUpdated').name('Now: updated').type('Date')
  site
    .createField('nextUp')
    .name('Next up')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['idea'] }] })
  site.changeFieldControl('openToWork', 'builtin', 'boolean')
  site.changeFieldControl('nowUpdated', 'builtin', 'datePicker', MONTH)

  // --- uses ------------------------------------------------------------------
  const usesItem = migration.createContentType('usesItem').name('Uses: item').displayField('name')
  usesItem.createField('name').name('Name').type('Symbol').required(true)
  usesItem.createField('why').name('Why').type('Symbol').required(true)
  usesItem
    .createField('url')
    .name('URL')
    .type('Symbol')
    .validations([{ regexp: { pattern: '^https?://\\S+$' } }])

  const usesGroup = migration
    .createContentType('usesGroup')
    .name('Uses: group')
    .displayField('title')
    .description('A section on /uses, e.g. “Editor & terminal”.')
  usesGroup.createField('title').name('Title').type('Symbol').required(true)
  usesGroup
    .createField('items')
    .name('Items')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['usesItem'] }] })

  const usesPage = migration
    .createContentType('usesPage')
    .name('Uses page')
    .displayField('internalName')
    .description('Create exactly one entry. Groups are shown in the order listed here.')
  usesPage.createField('internalName').name('Internal name').type('Symbol').required(true)
  usesPage
    .createField('groups')
    .name('Groups')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['usesGroup'] }] })
  usesPage.createField('lastUpdated').name('Last updated').type('Date').required(true)
  usesPage.createField('dotfilesUrl').name('Dotfiles URL').type('Symbol')
  usesPage.createField('favoriteCommand').name('Favourite command').type('Symbol')
  usesPage.createField('favoriteCommandNote').name('Favourite command: what it does').type('Symbol')
  usesPage.changeFieldControl('lastUpdated', 'builtin', 'datePicker', MONTH)

  // --- resume ----------------------------------------------------------------
  const role = migration
    .createContentType('resumeRole')
    .name('Resume: role')
    .displayField('internalName')
  role.createField('internalName').name('Internal name').type('Symbol').required(true)
  role.createField('role').name('Role').type('Symbol').required(true)
  role.createField('company').name('Company').type('Symbol').required(true)
  role.createField('startYear').name('Start year').type('Integer').required(true)
  role.createField('endYear').name('End year (empty = now)').type('Integer')
  role.createField('team').name('Team / product line').type('Symbol')
  role
    .createField('bullets')
    .name('Results')
    .type('Array')
    .items({ type: 'Symbol' })
    .validations([{ size: { min: 1, max: 3 } }])
  role.createField('stack').name('Stack').type('Array').items({ type: 'Symbol' })
  role.changeFieldControl('stack', 'builtin', 'tagEditor')
  role.changeFieldControl('bullets', 'builtin', 'listInput')

  const skillGroup = migration
    .createContentType('skillGroup')
    .name('Resume: skill group')
    .displayField('name')
  skillGroup.createField('name').name('Name').type('Symbol').required(true)
  skillGroup.createField('skills').name('Skills').type('Array').items({ type: 'Symbol' })
  skillGroup.changeFieldControl('skills', 'builtin', 'tagEditor')

  const resume = migration
    .createContentType('resume')
    .name('Resume')
    .displayField('internalName')
    .description('Create exactly one entry.')
  resume.createField('internalName').name('Internal name').type('Symbol').required(true)
  resume.createField('summary').name('Summary').type('Text').required(true)
  resume
    .createField('roles')
    .name('Roles (most recent first)')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['resumeRole'] }] })
    .validations([{ size: { max: 3 } }])
  resume
    .createField('skillGroups')
    .name('Skill groups')
    .type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['skillGroup'] }] })
  resume.createField('educationDegree').name('Education: degree').type('Symbol')
  resume.createField('educationSchool').name('Education: school').type('Symbol')
  resume.createField('educationYear').name('Education: year').type('Integer')
  resume
    .createField('spokenLanguages')
    .name('Languages')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [{ regexp: { pattern: '^[^:]+: .+$' }, message: 'Format: “Language: level”' }],
    })
  resume
    .createField('pdf')
    .name('PDF')
    .type('Link')
    .linkType('Asset')
    .required(true)
    .validations([{ linkMimetypeGroup: ['pdfdocument'] }])
  resume.createField('pdfPageCount').name('PDF page count').type('Integer').required(true)
  resume.createField('updated').name('Updated').type('Date').required(true)
  resume.changeFieldControl('summary', 'builtin', 'multipleLine')
  resume.changeFieldControl('spokenLanguages', 'builtin', 'listInput')
  resume.changeFieldControl('updated', 'builtin', 'datePicker', MONTH)
}
